from django.db.models.signals import post_save, post_delete
from django.db.models import Sum
from django.dispatch import receiver
from .models import Stock, Products


def update_total_stock(product):
    """
    Update the total stock quantity for a given product.
    
    This function calculates the sum of all stock quantities for a product
    and updates the `TotalStock` field in the `Products` model.

    Args:
        product (Products): The product instance whose total stock needs to be updated.
    """
    total_stock = (
        Stock.objects.filter(sub_variant__variant__product=product)
        .aggregate(total=Sum('quantity'))['total']
        or 0
    )
    product.TotalStock = total_stock
    product.save(update_fields=['TotalStock'])


@receiver(post_save, sender=Stock)
def update_total_stock_on_save(sender, instance, **kwargs):
    """
    Signal handler to update a product's total stock on stock creation or update.

    Triggered after a Stock instance is saved. It recalculates and updates the
    total stock quantity for the associated product.

    Args:
        sender (Model): The model class (Stock).
        instance (Stock): The instance of the saved stock.
        **kwargs: Additional keyword arguments.
    """
    product = instance.sub_variant.variant.product
    update_total_stock(product)


@receiver(post_delete, sender=Stock)
def update_total_stock_on_delete(sender, instance, **kwargs):
    """
    Signal handler to update a product's total stock on stock deletion.

    Triggered after a Stock instance is deleted. It recalculates and updates
    the total stock quantity for the associated product.

    Args:
        sender (Model): The model class (Stock).
        instance (Stock): The instance of the deleted stock.
        **kwargs: Additional keyword arguments.
    """
    product = instance.sub_variant.variant.product
    update_total_stock(product)
