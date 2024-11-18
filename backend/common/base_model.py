from django.db import models

class BaseModel(models.Model):
    """
    An abstract base model that provides common fields for tracking
    creation and last update timestamps for all models that inherit it.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """
        Marks this model as abstract so that it is not created as a database table.
        Subclasses will inherit this model.
        """
        abstract = True
