from datetime import datetime

import pymongo
from bson import ObjectId
import database as db
from services.gemini_service import analyze_issue
from utils.mongo_serializer import serialize_doc

issues_collection = db.issues_collection
fs = db.fs


async def create_issue(title, description, department, latitude, longitude, image, user_id):

    ai_result = analyze_issue(description)

    ai_department = ai_result["department"]
    priority = ai_result["priority"]
    priority_score = ai_result["priority_score"]

    image_bytes = await image.read()

    image_id = fs.put(
        image_bytes,
        filename=image.filename,
        content_type=image.content_type
    )

    new_issue = {
        "title": title,
        "description": description,

        "department": department,
        "ai_department": ai_department,

        "priority": priority,
        "priority_score": priority_score,

        "reported_by": ObjectId(user_id),

        "status": "raised",

        "image_id": image_id,

        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },

        "assigned_worker": None,

        "created_at": datetime.utcnow(),
        "resolved_at": None
    }

    result = issues_collection.insert_one(new_issue)

    return str(result.inserted_id)

def get_user_issues(user_id):

    issues = list(
        issues_collection.find(
            {"reported_by": ObjectId(user_id)}
        ).sort("created_at", -1)
    )

    return [serialize_doc(issue) for issue in issues]

def get_nearby_issues(lat, lng, radius):

    issues = list(
        issues_collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "$maxDistance": radius
                }
            }
        }).limit(25)
    )

    return [serialize_doc(issue) for issue in issues]