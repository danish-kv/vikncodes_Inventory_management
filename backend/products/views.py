from django.shortcuts import render
from django.db import transaction
from django.db.models import Sum
from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend, filters as django_filters
from rest_framework.filters import OrderingFilter

from .models import Products, Variants, SubVariants, Category, Transaction, Stock
from .serializers import (
    ProductSerializer,
    SubVariantSerializer,
    VariantSerializer,
    TransactionSerializer,
    CategorySerializer,
    ProductVariantSerializer,
)
from common.custom_permission import IsUser, IsAdmin
from users.models import CustomUser
from common.base_pagination import CustomPagination


class ProductViewSet(ModelViewSet):
    """
    Handles CRUD operations for products.

    Supports filtering, searching, and ordering by various fields.
    """

    queryset = Products.objects.all().select_related('product_category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, OrderingFilter]
    filterset_fields = ['Category']
    search_fields = ['ProductName', 'ProductCode']
    ordering_fields = ['created_at', 'Price']

    def create(self, request, *args, **kwargs):
        """
        Create a new product and associate it with the current user.
        """
        data = request.data.copy()
        data['CreatedUser'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        """
        Customize the queryset based on user type and query parameters.

        - Admin users see all products.
        - Regular users see only active products.
        - Optional filters for category and search.
        """
        user = self.request.user
        category_slug = self.request.query_params.get('category', None)
        search_query = self.request.query_params.get('search', None)

        queryset = Products.objects.all() if user.is_superuser else Products.objects.filter(IsActive=True)

        if category_slug:
            queryset = queryset.filter(Category__slug=category_slug)

        if search_query:
            queryset = queryset.filter(ProductName__icontains=search_query)

        return queryset


class CategoryViewSet(ModelViewSet):
    """
    Handles CRUD operations for product categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        """
        Restrict permissions based on user roles.

        - Read-only for regular users.
        - Full access for admin users.
        """
        if self.request.method in SAFE_METHODS and not self.request.user.is_superuser:
            return [IsUser()]
        return [IsAdmin()]


class VariantViewSet(ModelViewSet):
    """
    Handles CRUD operations for product variants.
    """

    queryset = Variants.objects.all()
    serializer_class = VariantSerializer
    permission_classes = [IsAuthenticated]


class SubVariantViewSet(ModelViewSet):
    """
    Handles CRUD operations for product sub-variants.
    """

    queryset = SubVariants.objects.all()
    serializer_class = SubVariantSerializer


class ProductVariantView(APIView):
    """
    Retrieves details of a product and its variants by slug.
    """

    def get(self, request, slug):
        product = get_object_or_404(Products, slug=slug)
        serializer = ProductVariantSerializer(product)
        return Response(serializer.data)


class ProductDashboardAPIView(APIView):
    """
    Provides a summary dashboard for products, categories, users, and sales.
    """

    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        try:
            total_products = Products.objects.count()
            total_category = Category.objects.count()
            total_user = CustomUser.objects.count()
            total_sales = Transaction.objects.aggregate(total=Sum('total_amount'))['total'] or 0

            return Response({
                'total_products': total_products,
                'total_category': total_category,
                'total_sales': total_sales,
                'total_user': total_user,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def check_stock(request):
    """
    Validates stock availability for selected variants and quantities.
    """
    product_id = request.data.get('product_id')
    selected_variants = request.data.get('selected_variants', {})
    requested_quantity = request.data.get('quantity')

    stock_checks = []

    for variant_id, subvariant_id in selected_variants.items():
        try:
            stock = Stock.objects.filter(
                sub_variant__variant__product=product_id,
                sub_variant=subvariant_id
            ).first()

            if not stock:
                stock_checks.append({'variant_id': variant_id, 'subvariant_id': subvariant_id, 'error': "No matching stock found"})
            elif stock.quantity < requested_quantity:
                stock_checks.append({'variant_id': variant_id, 'subvariant_id': subvariant_id, 'error': "Insufficient stock"})
            else:
                stock_checks.append({'variant_id': variant_id, 'subvariant_id': subvariant_id, 'available_stock': stock.quantity})
        except Exception as e:
            stock_checks.append({'variant_id': variant_id, 'subvariant_id': subvariant_id, 'error': "Error checking stock"})

    if any('error' in check for check in stock_checks):
        return Response(stock_checks, status=status.HTTP_400_BAD_REQUEST)

    return Response(stock_checks, status=status.HTTP_200_OK)


class PurchaseAPIView(APIView):
    """
    Handles product purchase transactions.
    """

    def post(self, request, *args, **kwargs):
        user = request.user
        stock_id = request.data.get('stock_id')
        quantity = request.data.get('quantity')

        if not stock_id or not quantity:
            return Response({"error": "Stock ID and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                stock = Stock.objects.filter(sub_variant=stock_id).select_for_update().first()

                if not stock:
                    return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

                if stock.quantity < float(quantity):
                    return Response({"error": "Insufficient stock available"}, status=status.HTTP_400_BAD_REQUEST)

                stock.remove_stock(float(quantity))

                transaction_obj = Transaction.objects.create(
                    user=user,
                    stock=stock,
                    quantity=quantity,
                    total_amount=float(quantity) * float(stock.sub_variant.variant.product.Price),
                )

            return Response({"message": "Purchase successful", "transaction_id": transaction_obj.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LandingPage(APIView):
    """
    Retrieves aggregate data for the landing page.
    """

    def get(self, request, *args, **kwargs):
        total_products = Products.objects.count()
        total_users = CustomUser.objects.count()

        return Response({'total_products': total_products, 'total_users': total_users})
