from django.db import models
from versatileimagefield.fields import VersatileImageField
import uuid
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from common.base_model import BaseModel
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F

# Custom user model for referencing the User model
CustomUser = get_user_model()


class Category(BaseModel):
    """
    Represents product categories. Each category has a unique name and slug.
    Categories are active by default unless explicitly marked inactive.
    """
    name = models.CharField(max_length=200, unique=True, db_index=True)
    slug = models.SlugField(unique=True, blank=True, null=True, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ('name',)

    def save(self, *args, **kwargs):
        """
        Auto-generates a unique slug for the category.
        """
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
    """
    Represents a product, including its details, pricing, and stock.
    A product belongs to a category and may have multiple variants.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    slug = models.SlugField(unique=True, blank=True, null=True, db_index=True)
    ProductID = models.BigIntegerField(unique=True)    
    ProductCode = models.CharField(max_length=255, unique=True, db_index=True)
    ProductName = models.CharField(max_length=255)    
    ProductImage = VersatileImageField(upload_to="products/", blank=True, null=True)    
    CreatedUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    IsActive = models.BooleanField(default=True)    
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
        """
        Auto-generates a unique slug for the product.
        """
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
    """
    Represents a variant of a product, such as color or size.
    Each product can have multiple variants.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Products, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'variant'
        verbose_name_plural = 'variants'
        ordering = ('-created_at',)
        unique_together = (("product", "name"),)


class SubVariants(BaseModel):
    """
    Represents sub-variants of a product variant, e.g., 'Size S' or 'Red'.
    Each variant can have multiple sub-variants.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant = models.ForeignKey(Variants, related_name='subvariants', on_delete=models.CASCADE)
    option_name = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'sub variant'
        verbose_name_plural = 'sub variants'
        ordering = ('-created_at',)
        unique_together = (("variant", "option_name"),)

    def __str__(self) -> str:
        return f"{self.option_name} ({self.variant.name})"


class Stock(BaseModel):
    """
    Represents stock for a specific sub-variant.
    Each sub-variant has a one-to-one relationship with a stock record.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    sub_variant = models.OneToOneField(SubVariants, related_name='stock', on_delete=models.CASCADE)
    quantity = models.DecimalField(
        default=0.00, max_digits=20, decimal_places=8, blank=True, null=True
    )

    class Meta:
        verbose_name = "Stock"
        verbose_name_plural = "Stocks"

    def add_stock(self, quantity):
        """
        Adds stock for this sub-variant.
        """
        with transaction.atomic():
            Stock.objects.filter(id=self.id).update(quantity=F('quantity') + quantity)
            self.refresh_from_db()

    def remove_stock(self, quantity):
        """
        Removes stock for this sub-variant. Prevents negative stock levels.
        """
        with transaction.atomic():
            current_stock = Stock.objects.filter(id=self.id).select_for_update().first()
            if current_stock.quantity < quantity:
                raise ValueError("Insufficient stock to complete this operation.")
            Stock.objects.filter(id=self.id).update(quantity=F('quantity')-quantity)
            self.refresh_from_db()

    def __str__(self):
        return f"{self.sub_variant.option_name} - {self.quantity}"


class Transaction(BaseModel):
    """
    Represents a transaction involving stock (either addition or subtraction).
    Tracks the quantity, user, and stock involved in the transaction.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='transactions', null=True)
    quantity = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)
    refrence_number = models.CharField(max_length=200, blank=True, null=True)
    total_amount = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        verbose_name = 'transaction'
        verbose_name_plural = 'transactions'
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        """
        Validates the transaction before saving. Ensures the quantity is positive
        and that there is enough stock available for the transaction.
        """
        if self.quantity <= 0:
            raise ValueError('Quantity must be greater than zero')

        with transaction.atomic():
            current_stock = Stock.objects.filter(id=self.stock.id).select_for_update().first()
            if current_stock.quantity < self.quantity:
                raise ValueError(f'Not enough stock available.')
            current_stock.remove_stock(self.quantity)

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.stock.sub_variant.variant.product.ProductName} - "
            f"{self.stock.sub_variant.option_name} - {self.quantity}"
        )
