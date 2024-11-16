from rest_framework.serializers import ModelSerializer 
from .models import Category, Products, SubVariants, Variants, Transaction
from users.serializers import UserSerializer



class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'slug', 'name']


class VariantSerializer(ModelSerializer):
    class Meta:
        model = Variants
        fields = ['id', 'product', 'name']


class SubVariantSerializer(ModelSerializer):
    variant = VariantSerializer(many=True)
    class Meta:
        model = SubVariants
        fields = ['id', 'variant', 'option_name']



class ProductSerializer(ModelSerializer):
    Category = CategorySerializer()
    class Meta:
        model = Products
        fields = '__all__'



class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'