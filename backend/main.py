import os
import certifi
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from models import Admin, Worker
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from pydantic import BaseModel
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def create_indexes():
    """Auto-create required MongoDB indexes on startup."""
    try:
        from database import db
        await db.issues.create_index([("location", "2dsphere")])
    except Exception as e:
        print(f"[startup] Index creation skipped or failed: {e}")


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
    # This updates the 'workers' list in the Admin document
    result = await db.admins.update_one(
        {"email": admin_email},
        {"$addToSet": {"workers": worker_id}}
    )
    if result.modified_count:
        return {"msg": f"Worker {worker_id} added to Admin {admin_email}"}
    return {"error": "Admin not found"}


@app.get("/worker/tasks/{email}")
async def get_my_tasks(email: str):
    # Fetch the worker and specifically return their assigned_tasks list
    worker = await db.workers.find_one({"email": email})
    if worker:
        return {"tasks": worker.get("assigned_tasks", [])}
    return {"error": "Worker not found"}


@app.put("/admin/assign-issue")
async def assign_issue_to_worker(issue_id: str, worker_id: str):
    # 1. Update the Issue document
    await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"assigned_worker": ObjectId(worker_id), "status": "assigned"}}
    )

    # 2. Update the Worker document
    await db.workers.update_one(
        {"_id": ObjectId(worker_id)},
        {"$addToSet": {"assigned_tasks": ObjectId(issue_id)}}
    )

    return {"msg": "Job assigned successfully!"}





@app.get("/admin/{admin_email}/workers")
async def get_admin_workers(admin_email: str):
    # 1. Find the admin document in the cloud
    admin = await db.admins.find_one({"email": admin_email})
    if not admin:
        return {"error": "Admin not found"}

    # 2. Get the list of worker IDs stored in that admin's 'workers' array
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
    # 1. Update the Worker: Add the Issue ID to their 'assigned_tasks'
    worker_result = await db.workers.update_one(
        {"email": worker_email},
        {"$addToSet": {"assigned_tasks": issue_id}}
    )

    # 2. Update the Issue: Link it to the worker and change status
    issue_result = await db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"assigned_worker": worker_email, "status": "assigned"}}
    )

    if worker_result.modified_count or issue_result.modified_count:
        return {"msg": f"Issue {issue_id} successfully assigned to {worker_email}"}
    return {"error": "Assignment failed. Check if IDs and emails are correct."}


@app.put("/worker/resolve-task/{issue_id}")
async def resolve_task(issue_id: str):
    # Update the status to 'resolved' and set the current time
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


# --- Bot & Simulator Endpoints ---

class BotMessage(BaseModel):
    message: str

class PolicyInput(BaseModel):
    policy: str


@app.post("/bot")
async def civic_bot(body: BotMessage):
    msg = body.message.lower()

    # Try Gemini first
    try:
        import asyncio
        from services.gemini_service import client as gemini_client

        prompt = f"""You are CivicAI, a helpful civic assistant chatbot. A citizen says:

"{body.message}"

Provide a helpful, concise response about civic issues (reporting problems, tracking issues, city services, etc.).
Keep it under 3 sentences."""

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: gemini_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
        )
        return {"reply": response.text}
    except Exception:
        pass

    # Fallback: keyword-based replies
    if "report" in msg:
        return {"reply": "You can report a civic issue using the Report page. Include a photo and description for faster response!"}
    if "track" in msg:
        return {"reply": "Head to the Track page to see real-time status updates on your submitted issues."}
    if "traffic" in msg:
        return {"reply": "Traffic issues can be reported with a photo and location so authorities can respond quickly."}
    if "garbage" in msg or "waste" in msg:
        return {"reply": "Garbage collection problems are a common civic issue. Report it with a photo for faster action."}
    if "water" in msg:
        return {"reply": "Water supply issues should be reported to the Water Supply department. Use the Report page to file a complaint."}
    if "hello" in msg or "hi" in msg:
        return {"reply": "Hello! I'm CivicAI, your civic assistant. I can help you report issues, track complaints, or learn about city services."}

    return {"reply": "I'm here to help with civic issues. You can ask about reporting problems, tracking issues, or city services!"}


@app.post("/simulate")
async def simulate_policy(body: PolicyInput):
    policy = body.policy.lower()

    # Try Gemini first
    try:
        import asyncio, json
        from services.gemini_service import client as gemini_client

        prompt = f"""You are a city policy impact simulator. A mayor proposes this policy:

"{body.policy}"

Estimate the impact on:
1. Traffic (percentage change, negative = improvement)
2. Pollution (percentage change, negative = improvement)
3. Citizen satisfaction (0-100 score)

Return ONLY valid JSON:
{{"traffic": <number>, "pollution": <number>, "satisfaction": <number>}}"""

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: gemini_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
        )
        data = json.loads(response.text)
        return {
            "traffic": data.get("traffic", 0),
            "pollution": data.get("pollution", 0),
            "satisfaction": data.get("satisfaction", 50)
        }
    except Exception:
        pass

    # Fallback: heuristic logic
    import random
    traffic = random.randint(-15, 10)
    pollution = random.randint(-10, 5)
    satisfaction = random.randint(40, 80)

    if "bus" in policy or "transit" in policy or "metro" in policy:
        traffic = random.randint(-20, -5)
        satisfaction = random.randint(60, 85)
    if "tree" in policy or "green" in policy or "park" in policy:
        pollution = random.randint(-15, -3)
        satisfaction = random.randint(65, 90)
    if "tax" in policy:
        satisfaction = random.randint(25, 50)

    return {"traffic": traffic, "pollution": pollution, "satisfaction": satisfaction}


# Ashmit - Start

app.include_router(user_router)

app.include_router(auth_router)


# Ashmit - End
