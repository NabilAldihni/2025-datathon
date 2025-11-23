from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db import init_db
from app.oauth import router as oauth_router
from app.jobs import router as jobs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting 2025 Datathon API...")

    # Initialize Mongo
    await init_db()

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

