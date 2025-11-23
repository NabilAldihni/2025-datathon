from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow

from app.db import db

router = APIRouter()

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
REDIRECT_URI = "http://localhost:8000/gmail/oauth/callback"

def get_flow():
    return Flow.from_client_secrets_file(
        "credentials.json",
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )

@router.get("/oauth/start")
async def oauth_start():
    flow = get_flow()

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )
    return {"auth_url": auth_url}

@router.get("/oauth/callback")
async def oauth_callback(request: Request):
    code = request.query_params.get("code")

    flow = get_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials

    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes,
    }

    db.tokens.update_one(
        {"name": "gmail"},
        {"$set": token_data},
        upsert=True
    )

    return RedirectResponse("http://localhost:3000/gmail-connected")

