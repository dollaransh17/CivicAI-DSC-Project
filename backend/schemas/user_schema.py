

from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    locality: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str