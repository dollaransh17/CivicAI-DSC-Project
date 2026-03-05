from fastapi import APIRouter
from schemas.user_schema import UserSignup, UserLogin
from services.auth_service import signup_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(user: UserSignup):

    token = signup_user(user)

    return {
        "message": "User created",
        "token": token
    }


@router.post("/login")
def login(user: UserLogin):

    token = login_user(user)

    return {
        "message": "Login successful",
        "token": token
    }