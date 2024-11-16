from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Products, Variants, SubVariants, Category, Transaction
from .serializers import ProductSerializer, SubVariantSerializer, VariantSerializer, TransactionSerializer, CategorySerializer
from common.custom_permission import IsUser, IsAdmin
from rest_framework.permissions import SAFE_METHODS

# Create your views here.


class ProductViewSet(ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated]
    


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS and not self.request.user.is_superuser:
            print(self.request.user)
            return [IsUser() ]
        return [IsAdmin()]

class VariantViewSet(ModelViewSet):
    queryset = Variants.objects.all()
    serializer_class = VariantSerializer
    permission_classes = [IsAuthenticated]


class SubVariantViewSet(ModelViewSet):
    queryset = SubVariants.objects.all()
    serializer_class = SubVariantSerializer
    permission_classes = [IsAuthenticated]
