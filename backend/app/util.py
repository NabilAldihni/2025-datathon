import re

GENERIC_SENDERS = {
    "amazonses.com",
    "mailgun.org",
    "sendgrid.net",
    "mandrillapp.com",
    "sparkpostmail.com",
    "sendinblue.com",
}

def extract_sender_domain(headers):
    for h in headers:
        if h["name"].lower() == "from":
            match = re.search(r'@([A-Za-z0-9.-]+)', h["value"])
            return match.group(1).lower() if match else None
    return None

def root_domain(domain):
    parts = domain.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return domain

def strip_tld(domain):
    parts = domain.split(".")
    if len(parts) >= 2:
        return ".".join(parts[:-1])
    return domain

