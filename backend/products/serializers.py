from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Category, Products, SubVariants, Variants, Transaction, Stock
from users.serializers import UserSerializer


class CategorySerializer(ModelSerializer):
    """
    Serializer for the `Category` model.
    """
    class Meta:
        model = Category
        fields = ['id', 'slug', 'name', 'is_active', 'updated_at']


class StockSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Stock` model.
    """
    class Meta:
        model = Stock
        fields = ['id', 'quantity']


class SubVariantSerializer(serializers.ModelSerializer):
    """
    Serializer for the `SubVariants` model. 
    Includes functionality to handle stock creation and retrieval.
    """
    stock = serializers.SerializerMethodField()
    stock_quantity = serializers.DecimalField(
        max_digits=20, decimal_places=8, write_only=True
    )

    class Meta:
        model = SubVariants
        fields = ['id', 'variant', 'option_name', 'stock', 'stock_quantity']

    def create(self, validated_data):
        """
        Override create method to handle associated stock creation.
        """
        stock_quantity = validated_data.pop('stock_quantity', 0)  # Get stock quantity from data
        sub_variant = super().create(validated_data)  # Create sub-variant
        
        # Create stock if quantity is provided
        if stock_quantity:
            Stock.objects.create(sub_variant=sub_variant, quantity=stock_quantity)
        
        return sub_variant

    def get_stock(self, obj):
        """
        Retrieve the stock quantity associated with this sub-variant.
        """
        stock = getattr(obj, 'stock', None)
        return stock.quantity if stock else 0


class VariantSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Variants` model.
    Includes nested sub-variant data.
    """
    subvariants = SubVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Variants
        fields = ['id', 'name', 'subvariants', 'product']


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Products` model.
    Includes nested category and variant data.
    """
    category_data = CategorySerializer(source='Category', read_only=True)
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Products
        fields = '__all__'


class TransactionSerializer(ModelSerializer):
    """
    Serializer for the `Transaction` model.
    """
    class Meta:
        model = Transaction
        fields = '__all__'


class ProductVariantSerializer(serializers.Serializer):
    """
    Custom serializer for fetching product variants and associated sub-variants.
    """
    slug = serializers.SlugField()
    variants = serializers.SerializerMethodField()

    def get_variants(self, obj):
        """
        Retrieve variants and sub-variants for a product, including stock data.
        """
        data = []
        variants = obj.variants.prefetch_related('subvariants', 'subvariants__stock')
        
        for variant in variants:
            # If variant has no sub-variants, add it directly
            if not variant.subvariants.exists():
                data.append({
                    'variant_id': variant.id,
                    'variant_name': variant.name,
                })
            else:
                # Include sub-variants with stock data
                for sub_variant in variant.subvariants.all():
                    stock = getattr(sub_variant, 'stock', None)
                    stock_quantity = stock.quantity if stock else 0
                    
                    data.append({
                        'variant_id': variant.id,
                        'variant_name': variant.name,
                        'sub_variant_id': sub_variant.id,
                        'sub_variant_name': sub_variant.option_name,
                        'stock': stock_quantity
                    })
        
        return data
