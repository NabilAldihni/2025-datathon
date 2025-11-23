from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    print("Starting 2025 Datathon API...")
    yield
    # shutdown
    print("Shutting down 2025 Datathon API...")

app = FastAPI(title="Aegis Internal API", version="0.1.0", lifespan=lifespan)

# Simple CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary="Welcome")
async def root():
    return {"message": "Hello from backend! Visit /docs for the OpenAPI UI."}