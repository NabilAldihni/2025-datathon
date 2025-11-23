import os
import asyncio
from typing import Optional, Set
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# /C:/Users/sebas/Desktop/2025-datathon/backend/middleware/auth.py


# Requires: google-auth


class GmailAuthMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware that verifies Google ID tokens (Gmail/Google Sign-In).
    On success, sets request.state.user to the token payload (dict).
    """

    def __init__(self, app, client_id: Optional[str] = None, exempt_paths: Optional[Set[str]] = None):
        super().__init__(app)
        self.client_id = client_id or os.getenv("GOOGLE_CLIENT_ID")
        if not self.client_id:
            raise RuntimeError("GOOGLE_CLIENT_ID must be provided via argument or env var")
        self.exempt_paths = exempt_paths or set()

    async def dispatch(self, request: Request, call_next):
        # Skip verification for exempt paths
        if request.url.path in self.exempt_paths:
            return await call_next(request)

        auth = request.headers.get("Authorization", "")
        if not auth or not auth.lower().startswith("bearer "):
            return JSONResponse({"detail": "Missing or invalid Authorization header"}, status_code=401)

        token = auth.split(" ", 1)[1].strip()

        # verify_oauth2_token is blocking; run in executor
        loop = asyncio.get_running_loop()

        def _verify(token):
            return id_token.verify_oauth2_token(token, google_requests.Request(), self.client_id)

        try:
            id_info = await loop.run_in_executor(None, _verify, token)
        except ValueError:
            return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)
        except Exception:
            return JSONResponse({"detail": "Token verification failed"}, status_code=401)

        # Attach minimal user info to request.state
        request.state.user = {
            "sub": id_info.get("sub"),
            "email": id_info.get("email"),
            "email_verified": id_info.get("email_verified"),
            "name": id_info.get("name"),
            "picture": id_info.get("picture"),
            "locale": id_info.get("locale"),
        }

        return await call_next(request)