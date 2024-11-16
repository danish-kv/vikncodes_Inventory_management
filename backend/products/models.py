from django.db import models
from versatileimagefield.fields import VersatileImageField
import uuid
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from common.base_model import BaseModel

# Create your models here.



class Category(BaseModel):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ('name',)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    

    def __str__(self):
        return self.name
    
    
class Products(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    slug = models.SlugField(unique=True, blank=True, null=True)
    ProductID = models.BigIntegerField(unique=True)    
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)    
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)    
    CreatedUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)    
    HSNCode = models.CharField(max_length=255, blank=True, null=True)    
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)
    Category = models.ForeignKey(Category, related_name='product_category', on_delete=models.CASCADE)

    class Meta:
        db_table = "products_product"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.ProductName)
        super().save(*args, **kwargs)
    

    def __str__(self) -> str:
        return self.ProductName

