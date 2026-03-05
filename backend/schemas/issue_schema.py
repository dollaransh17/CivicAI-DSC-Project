from pydantic import BaseModel

class IssueCreate(BaseModel):
    title: str
    description: str
    department: str
    latitude: float
    longitude: float