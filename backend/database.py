from pymongo import MongoClient
import gridfs
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DATABASE_NAME")
client = MongoClient(MONGO_URL)

db = client[DB_NAME]

users_collection = db["users"]
issues_collection = db["issues"]
admins_collection = db["admins"]
workers_collection = db["workers"]
fs = gridfs.GridFS(db)