import logging

logger = logging.getLogger('api_usage')

class ApiUsageLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        logger.info(
            f"API Request - Method: {request.method}, Path: {request.path}, "
            f"User: {request.user if request.user.is_authenticated else 'Anonymous'}, "
            f"Status Code: {response.status_code}"
        )
        return response
