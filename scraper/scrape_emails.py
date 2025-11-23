from __future__ import print_function
import base64
import re
import os
import json
from email import message_from_bytes
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

GENERIC_SENDERS = {
    "amazonses.com",
    "mailgun.org",
    "sendgrid.net",
    "mandrillapp.com",
    "sparkpostmail.com",
    "sendinblue.com",
}

# OAuth scopes: read-only access to your Gmail
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

def get_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)

def search_message_ids(service, query):
    ids = []
    response = service.users().messages().list(userId="me", q=query, maxResults=500).execute()
    if "messages" in response:
        ids.extend(m["id"] for m in response["messages"])
    while "nextPageToken" in response:
        response = service.users().messages().list(
            userId="me", q=query, pageToken=response["nextPageToken"], maxResults=500
        ).execute()
        if "messages" in response:
            ids.extend(m["id"] for m in response["messages"])
    return ids

def extract_sender_domain(headers):
    for h in headers:
        if h["name"].lower() == "from":
            match = re.search(r'@([A-Za-z0-9.-]+)', h["value"])
            return match.group(1).lower() if match else None
    return None

def normalize_domain(domain):
    # strip subdomains
    parts = domain.split(".")
    if len(parts) >= 2:
        domain = ".".join(parts[-2:])
    if domain in GENERIC_SENDERS:
        return None
    return domain


def main():
    service = get_service()

    # Queries catching most signup emails
    queries = [
        'subject:("welcome" OR "account" OR "confirm" OR "verify")',
        # '"unsubscribe"',
        # 'newer_than:2y'
    ]

    all_ids = set()
    print("Starting all queries")
    for q in queries:
        all_ids.update(search_message_ids(service, q))
    print("Finished all queries")
    print(len(all_ids))

    domains = set()

    print("Getting all email companies")
    for msg_id in all_ids:
        msg = service.users().messages().get(userId="me", id=msg_id, format="metadata", metadataHeaders=["From"]).execute()
        raw = extract_sender_domain(msg.get("payload", {}).get("headers", []))
        if raw:
            domain = normalize_domain(raw)
            if domain:
                domains.add(domain)
    print("Done")

    print("Finished normalising")
    with open("services.json", "w") as f:
        json.dump({"services": sorted(domains)}, f, indent=2)
    print("Output written to services.json")

if __name__ == "__main__":
    main()

