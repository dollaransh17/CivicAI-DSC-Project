from datetime import datetime
from bson import ObjectId
import database as db

issues_collection = db.issues_collection
fs = db.fs


async def create_issue(title, description, department, latitude, longitude, image, user_id):

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
        "reported_by": ObjectId(user_id),
        "priority": "pending",
        "status": "raised",
        "image_id": image_id,
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "assigned_worker": None,
        "created_at": datetime.utcnow()
    }

    result = issues_collection.insert_one(new_issue)

    return str(result.inserted_id)