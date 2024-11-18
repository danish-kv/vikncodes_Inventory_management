from django.db.models.signals import post_delete, post_save
from django.db.models import Sum
from django.dispatch import receiver
from .models import Stock, Products



def update_total_stock(product):
    total_stock = Stock.objects.filter(sub_variant__variant__product=product).aggregate(total=Sum('quantity'))['total'] or 0
    product.TotalStock = total_stock
    product.save(update_fields=['TotalStock'])


@receiver(post_save, sender=Stock)
def update_total_stock_on_save(sender, instance, **kwargs):
    product = instance.sub_variant.variant.product
    update_total_stock(product)


@receiver(post_delete, sender=Stock)
def update_total_stock_on_save(sender, instance, **kwargs):
    product = instance.sub_variant.variant.product
    update_total_stock(product)
