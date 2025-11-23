from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db import init_db
from app.oauth import router as oauth_router
from app.jobs import router as jobs_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting API...")
    app.state.db = init_db()
    yield
    print("Shutting down API...")

app = FastAPI(
    title="Aegis Internal API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(oauth_router, prefix="/gmail")
app.include_router(jobs_router)

@app.get("/")
async def root():
    return {"message": "Hello from backend! Visit /docs for the OpenAPI UI."}

@app.get("/get-analysis", summary="analyze Terms of Service")
async def analyze_and_compare(tos: str):
    '''
    Analyzes the provided Terms of Service text and returns flagged sections.

    :tos: Terms of Service text to analyze.
    :return: A list of flagged sections with explanations.

    <Author: Ahmad>
    '''
    return
