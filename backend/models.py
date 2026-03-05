from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- ADMIN SCHEMA ---
class Admin(BaseModel):
    name: str
    email: EmailStr
    password_hash: str
    department: str
    post: str
    workers: List[str] = [] 

# --- WORKER SCHEMA ---
class Worker(BaseModel):
    name: str
    email: EmailStr
    password_hash: str
    department: str
    specialization: str
    assigned_tasks: List[str] = []

# No stray words like 'cite' should be here
Admin.model_rebuild()
Worker.model_rebuild()