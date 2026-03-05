from fastapi import FastAPI
from  routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(user_router)

app.include_router(auth_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
