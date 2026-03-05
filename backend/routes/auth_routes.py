from fastapi import APIRouter, HTTPException
from database import users_collection
from schemas.user_schema import UserSignup, UserLogin
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_access_token
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])



@router.post("/signup")
def signup(user: UserSignup):

    if len(user.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,

            detail="Password must be less than 72 characters"
        )

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "locality": user.locality,
        "role": "user",
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(new_user)

    token = create_access_token({
        "user_id": str(result.inserted_id)
    })

    return {
        "message": "User created",
        "token": token
    }

@router.post("/login")
def login(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(db_user["_id"])
    })

    return {
        "message": "Login successful",
        "token": token
    }