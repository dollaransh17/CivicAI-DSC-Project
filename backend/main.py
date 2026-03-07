import os
import certifi
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from models import Admin, Worker
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from fastapi.staticfiles import StaticFiles
from datetime import datetime
from bson import ObjectId
from database import client, db
from fastapi.middleware.cors import CORSMiddleware


# Suhas - Start
# This loads the link from your .env file (which we will make next)
load_dotenv()

app = FastAPI()

# Connection logic
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




<<<<<<< HEAD



=======
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
@app.get("/")
async def read_root():
    try:
        # This 'pings' the database to check if the connection is alive
        await client.admin.command('ping')
        return {
            "status": "Backend is running!",
            "database": "Connected to MongoDB Atlas! ✅"
        }
    except Exception as e:
        return {
            "status": "Backend is running!",
            "database": "Connection Failed ❌",
            "error": str(e)
        }


# YOUR TASK: Create an Admin
@app.post("/register-admin")
async def create_admin(admin: Admin):
    new_admin = await db.admins.insert_one(admin.dict())
    return {"id": str(new_admin.inserted_id), "msg": "Admin created!"}


# YOUR TASK: Create a Worker
@app.post("/register-worker")
async def create_worker(worker: Worker):
    new_worker = await db.workers.insert_one(worker.dict())
    return {"id": str(new_worker.inserted_id), "msg": "Worker created!"}


@app.put("/admin/add-worker-to-team")
async def link_worker_to_admin(admin_email: str, worker_id: str):
<<<<<<< HEAD
    # This updates the 'workers' list in the Admin document
=======
    # This updates the 'workers' list in the Admin document 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    result = await db.admins.update_one(
        {"email": admin_email},
        {"$addToSet": {"workers": worker_id}}
    )
    if result.modified_count:
        return {"msg": f"Worker {worker_id} added to Admin {admin_email}"}
    return {"error": "Admin not found"}


@app.get("/worker/tasks/{email}")
async def get_my_tasks(email: str):
<<<<<<< HEAD
    # Fetch the worker and specifically return their assigned_tasks list
=======
    # Fetch the worker and specifically return their assigned_tasks list 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    worker = await db.workers.find_one({"email": email})
    if worker:
        return {"tasks": worker.get("assigned_tasks", [])}
    return {"error": "Worker not found"}


@app.put("/admin/assign-issue")
async def assign_issue_to_worker(issue_id: str, worker_id: str):
<<<<<<< HEAD
    # 1. Update the Issue document
=======
    # 1. Update the Issue document 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"assigned_worker": ObjectId(worker_id), "status": "assigned"}}
    )

<<<<<<< HEAD
    # 2. Update the Worker document
=======
    # 2. Update the Worker document 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    await db.workers.update_one(
        {"_id": ObjectId(worker_id)},
        {"$addToSet": {"assigned_tasks": ObjectId(issue_id)}}
    )

    return {"msg": "Job assigned successfully!"}





@app.get("/admin/{admin_email}/workers")
async def get_admin_workers(admin_email: str):
<<<<<<< HEAD
    # 1. Find the admin document in the cloud
=======
    # 1. Find the admin document in the cloud 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    admin = await db.admins.find_one({"email": admin_email})
    if not admin:
        return {"error": "Admin not found"}

<<<<<<< HEAD
    # 2. Get the list of worker IDs stored in that admin's 'workers' array
=======
    # 2. Get the list of worker IDs stored in that admin's 'workers' array 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    worker_ids = admin.get("workers", [])

    # 3. Look up the full details for each of those IDs
    managed_workers = []
    for w_id in worker_ids:
        try:
            worker = await db.workers.find_one({"_id": ObjectId(w_id)})
            if worker:
                worker["_id"] = str(worker["_id"])  # Convert for JSON
                managed_workers.append(worker)
        except:
            continue  # Skip if ID is formatted incorrectly

    return {"managed_workers": managed_workers}


@app.put("/admin/assign-issue")
async def assign_issue_to_worker(issue_id: str, worker_email: str):
<<<<<<< HEAD
    # 1. Update the Worker: Add the Issue ID to their 'assigned_tasks'
=======
    # 1. Update the Worker: Add the Issue ID to their 'assigned_tasks' 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    worker_result = await db.workers.update_one(
        {"email": worker_email},
        {"$addToSet": {"assigned_tasks": issue_id}}
    )

<<<<<<< HEAD
    # 2. Update the Issue: Link it to the worker and change status
=======
    # 2. Update the Issue: Link it to the worker and change status 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    issue_result = await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"assigned_worker": worker_email, "status": "assigned"}}
    )

    if worker_result.modified_count or issue_result.modified_count:
        return {"msg": f"Issue {issue_id} successfully assigned to {worker_email}"}
    return {"error": "Assignment failed. Check if IDs and emails are correct."}


@app.put("/worker/resolve-task/{issue_id}")
async def resolve_task(issue_id: str):
<<<<<<< HEAD
    # Update the status to 'resolved' and set the current time
=======
    # Update the status to 'resolved' and set the current time 
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
    result = await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {
            "$set": {
                "status": "resolved",
                "resolved_at": datetime.utcnow().isoformat()
            }
        }
    )
    return {"msg": "Great job! Issue marked as resolved. ✅"}


@app.put("/admin/assign-issue")
async def assign_issue_to_worker(issue_id: str, worker_email: str):
    # 1. Check if worker exists first
    worker = await db.workers.find_one({"email": worker_email})
    if not worker:
        return {"error": "Cannot assign: Worker email not found in database."}

    # 2. Update Worker and Issue
    await db.workers.update_one(
        {"email": worker_email},
        {"$addToSet": {"assigned_tasks": issue_id}}
    )

    await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"assigned_worker": worker_email, "status": "assigned"}}
    )

    return {"msg": "Assignment successful!"}


# Suhas - End


# Ashmit - Start

<<<<<<< HEAD



=======
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
app.include_router(user_router)

app.include_router(auth_router)


<<<<<<< HEAD
# Ashmit - End
=======
# Ashmit - End
>>>>>>> f200d2d (Finalized Admin and Worker logic: assignment, team linking, and status updates)
