from fastapi import APIRouter, Depends, UploadFile, File, Form
from services.issue_service import create_issue
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/report")
async def report_issue(
    title: str = Form(...),
    description: str = Form(...),
    department: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(...),
    user=Depends(get_current_user)
):

    issue_id = await create_issue(
        title,
        description,
        department,
        latitude,
        longitude,
        image,
        user["_id"]
    )

    return {
        "message": "Issue reported successfully",
        "issue_id": issue_id
    }