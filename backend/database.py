from main import db
import gridfs

users_collection = db.users
issues_collection = db.issues
admins_collection = db.admins
workers_collection = db.workers
fs = gridfs.GridFS(db)

