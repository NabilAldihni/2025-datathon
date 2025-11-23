from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import pandas as pd
import json
from openai import OpenAI
import time

try:
    from app.db import init_db
    _HAS_DB = True
except Exception as e:
    init_db = None
    _HAS_DB = False
    print("[startup] DB disabled:", e)
try:
    from app.oauth import router as oauth_router
    _HAS_OAUTH = True
except Exception as e:
    oauth_router = None
    _HAS_OAUTH = False
    print("[startup] OAuth router disabled:", e)
try:
    from app.jobs import router as jobs_router
    _HAS_JOBS = True
except Exception as e:
    jobs_router = None
    _HAS_JOBS = False
    print("[startup] Jobs router disabled:", e)
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


df_cases = pd.read_csv("cases.csv")

CASES_TEXT = "\n".join(
    f"{row['id']}: {row['title']} — {row['description']}"
    for _, row in df_cases.iterrows()
)

case_lookup = {
    int(row["id"]): {
        "case_id": int(row["id"]),
        "title": row["title"],
        "description": row["description"]
    }
    for _, row in df_cases.iterrows()
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting API...")
    app.state.db = init_db() if _HAS_DB and init_db is not None else None
    yield

    print("Shutting down 2025 Datathon API...")


app = FastAPI(
    title="Aegis Internal API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(oauth_router)   # /auth/google/login + /auth/google/callback
app.include_router(jobs_router)    # /api/discovery/start + /api/discovery/status


@app.get("/", summary="Welcome")
async def root():
    return {"message": "Hello from backend. Visit /docs for API UI."}

@app.get("/get-analysis", summary="analyze Terms of Service")
async def analyze_and_compare(tos: str):
    """
    Takes a Terms of Service text, sends it to GPT-4.1-mini with
    the ToS;DR case definitions, and returns a list of cases:
    [{case_id, title, description}, ...]
    """

    SYSTEM_PROMPT = """
    You are an expert ToS;DR privacy case classifier.
    Given a Terms of Service document and a list of case definitions,
    you must return ONLY a JSON array of numeric case IDs.
    No explanations and no extra text.
    """

    USER_PROMPT = f"""
    Here are the ToS;DR cases:
    {CASES_TEXT}

    ---

    Document:
    \"\"\"{tos}\"\"\"

    ---

    Return ONLY a JSON array of case IDs:
    """

    print("[analysis] OpenAI call starting... tos_len=", len(tos))
    _t0 = time.perf_counter()
    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT}
        ]
    )
    _dt = time.perf_counter() - _t0
    print(f"[analysis] OpenAI call finished in {_dt:.2f}s")

    raw = completion.choices[0].message.content

    try:
        case_ids = json.loads(raw)
        if not isinstance(case_ids, list):
            raise ValueError
    except Exception:
        return {
            "error": "Model returned invalid JSON",
            "raw_output": raw
        }

    enriched = [
        case_lookup.get(int(cid), {"case_id": cid, "title": "Unknown", "description": ""})
        for cid in case_ids
    ]

    return {"cases": enriched}

