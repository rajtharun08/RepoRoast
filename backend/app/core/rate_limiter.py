from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize SlowAPI rate limiter based on client IP
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
