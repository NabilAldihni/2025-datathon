import os
from fastapi import APIRouter, Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import BatchHttpRequest
from app.util import extract_sender_domain, root_domain, strip_tld
router = APIRouter()


def get_service(request):
    db = request.app.state.db
    doc = db.tokens.find_one({"name": "gmail"})
    if not doc:
        raise Exception("Gmail OAuth not completed")

    creds = Credentials(
        token=doc["token"],
        refresh_token=doc["refresh_token"],
        token_uri=doc["token_uri"],
        client_id=doc["client_id"],
        client_secret=doc["client_secret"],
        scopes=doc["scopes"]
    )

    return build("gmail", "v1", credentials=creds)


def search_message_ids(service, q):
    ids = []
    resp = service.users().messages().list(userId="me", q=q, maxResults=500).execute()

    if "messages" in resp:
        ids.extend(m["id"] for m in resp["messages"])

    while "nextPageToken" in resp:
        resp = service.users().messages().list(
            userId="me",
            q=q,
            pageToken=resp["nextPageToken"],
            maxResults=500
        ).execute()
        if "messages" in resp:
            ids.extend(m["id"] for m in resp["messages"])

    return ids


def fetch_domains_in_batches(service, ids):
    domains = set()
    batch_size = 100

    def callback(request_id, response, exception):
        if exception:
            return
        raw = extract_sender_domain(
            response.get("payload", {}).get("headers", [])
        )
        if raw:
            rd = root_domain(raw)
            domains.add(rd)

    for i in range(0, len(ids), batch_size):
        batch = service.new_batch_http_request(callback=callback)
        for msg_id in ids[i:i + batch_size]:
            batch.add(
                service.users().messages().get(
                    userId="me",
                    id=msg_id,
                    format="metadata",
                    metadataHeaders=["From"]
                )
            )
        batch.execute()

    return domains


def run_discovery(request):
    service = get_service(request)

    queries = [
        'subject:("welcome" OR "account" OR "confirm" OR "verify")',
    ]

    all_ids = set()
    for q in queries:
        all_ids.update(search_message_ids(service, q))

    domains = fetch_domains_in_batches(service, list(all_ids))

    cleaned = sorted({strip_tld(d) for d in domains})
    return cleaned


@router.post("/start-discovery")
async def start_discovery(request: Request):
    return run_discovery(request)

