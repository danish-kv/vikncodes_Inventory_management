from django.contrib import admin
from .models import Category, Products, SubVariants, Variants, Stock

# Register your models here.


admin.site.register(Category)
admin.site.register(Products)
admin.site.register(Variants)
admin.site.register(SubVariants)
admin.site.register(Stock)