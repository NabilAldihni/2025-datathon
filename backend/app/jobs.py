from fastapi import APIRouter, BackgroundTasks
from uuid import uuid4
from datetime import datetime

from app.db import db
from app.gmail import run_discovery

router = APIRouter()

def run_job(job_id):
    try:
        db.gmail_jobs.update_one(
            {"job_id": job_id},
            {"$set": {"status": "running", "started_at": datetime.utcnow()}}
        )

        result = run_discovery()

        db.gmail_jobs.update_one(
            {"job_id": job_id},
            {
                "$set": {
                    "status": "done",
                    "finished_at": datetime.utcnow(),
                    "result": result
                }
            }
        )

    except Exception as e:
        db.gmail_jobs.update_one(
            {"job_id": job_id},
            {
                "$set": {
                    "status": "error",
                    "error": str(e),
                    "finished_at": datetime.utcnow()
                }
            }
        )


@router.post("/start-discovery")
async def start_discovery(background_tasks: BackgroundTasks):
    job_id = str(uuid4())

    db.gmail_jobs.insert_one({
        "job_id": job_id,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "started_at": None,
        "finished_at": None,
        "result": None,
        "error": None
    })

    background_tasks.add_task(run_job, job_id)

    return {"job_id": job_id}


@router.get("/discovery-status/{job_id}")
async def discovery_status(job_id: str):
    job = db.gmail_jobs.find_one({"job_id": job_id}, {"_id": 0})
    if not job:
        return {"error": "unknown_job"}
    return job

