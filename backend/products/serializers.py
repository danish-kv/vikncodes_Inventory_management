from rest_framework.serializers import ModelSerializer 
from .models import Category, Products, SubVariants, Variants, Transaction, Stock
from users.serializers import UserSerializer
from rest_framework import serializers



class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'slug', 'name', 'is_active', 'updated_at']


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'quantity']


class SubVariantSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    stock_quantity = serializers.DecimalField(max_digits=20, decimal_places=8, write_only=True)

    class Meta:
        model = SubVariants
        fields = ['id', 'variant', 'option_name', 'stock', 'stock_quantity']  


    def create(self, validated_data):
        stock_quantity = validated_data.pop('stock_quantity', 0)  
        sub_variant = super().create(validated_data) 

        if stock_quantity:
            Stock.objects.create(sub_variant=sub_variant, quantity=stock_quantity)

        return sub_variant

    def get_stock(self, obj):
        stock = getattr(obj, 'stock', None)
        return stock.quantity if stock else 0
    
    
class VariantSerializer(serializers.ModelSerializer):
    subvariants = SubVariantSerializer(many=True, read_only=True) 
    

    class Meta:
        model = Variants
        fields = ['id', 'name', 'subvariants', 'product']  
    


class ProductSerializer(serializers.ModelSerializer):
    category_data = CategorySerializer(source='Category', read_only=True)
    variants = VariantSerializer(many=True, read_only=True) 

    class Meta:
        model = Products
        fields = '__all__' 



class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'



class ProductVariantSerializer(serializers.Serializer):
    slug = serializers.SlugField()
    variants = serializers.SerializerMethodField()

    def get_variants(self, obj):
        data = []
        variants = obj.variants.prefetch_related('subvariants', 'subvariants__stock')
        
        for variant in variants:
            if not variant.subvariants.exists():
                data.append({
                    'variant_id': variant.id,
                    'variant_name': variant.name,
                })
            else:
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

