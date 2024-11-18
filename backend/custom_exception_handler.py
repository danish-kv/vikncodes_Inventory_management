import logging

logger = logging.getLogger('django')

def custom_exception_handler(exc, context):
    from rest_framework.views import exception_handler
    
    response = exception_handler(exc, context)

    # Log the exception
    if response is None or response.status_code >= 500:
        request = context.get('request', None)
        logger.error(
            f"Unhandled Exception - Method: {request.method if request else 'Unknown'}, "
            f"Path: {request.path if request else 'Unknown'}, "
            f"Exception: {exc}"
        )
    return response
