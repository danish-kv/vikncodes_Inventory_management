from django.db import models
from versatileimagefield.fields import VersatileImageField
import uuid
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from common.base_model import BaseModel
from django.contrib.auth import get_user_model

# Create your models here.

CustomUser = get_user_model()



class Category(BaseModel):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ('name',)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1
            while Category.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)
    

    def __str__(self):
        return self.name
    
    
class Products(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    slug = models.SlugField(unique=True, blank=True, null=True, db_index=True)
    ProductID = models.BigIntegerField(unique=True)    
    ProductCode = models.CharField(max_length=255, unique=True, db_index=True)
    ProductName = models.CharField(max_length=255)    
    ProductImage = VersatileImageField(upload_to="products/", blank=True, null=True)    
    CreatedUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)    
    HSNCode = models.CharField(max_length=255, blank=True, null=True)    
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)
    Description = models.TextField(null=True)
    Category = models.ForeignKey(Category, related_name='product_category', on_delete=models.CASCADE, db_index=True)
    Price = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        db_table = "products_product"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-created_at", "ProductID")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.ProductName)
            unique_slug = base_slug
            num = 1
            while Products.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)
    

    def __str__(self):
        return f"{self.ProductName} ({self.ProductCode})"



class Variants(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Products, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'variant'
        verbose_name_plural = 'variants'
        ordering = ('-created_at',)


class SubVariants(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant = models.ForeignKey(Variants, related_name='subvariants', on_delete=models.CASCADE)
    option_name = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'sub variant'
        verbose_name_plural = 'sub variants'
        ordering = ('-created_at',)


    def __str__(self) -> str:
        return f"{self.option_name} ({self.variant.name})"
    

class Transaction(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user')
    variant = models.ForeignKey(SubVariants, on_delete=models.CASCADE, related_name='purchased_product')
    quantity = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)
    refrence_number = models.CharField(max_length=200, blank=True, null=True)
    total_amount = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        verbose_name = 'transaction'
        verbose_name_plural = 'transactions'
        ordering = ('-created_at',)

    def __str__(self):
        return f"{self.variant.product.ProductName} - {self.quantity} - {self.variant.product.Price}"