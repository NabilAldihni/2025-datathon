from pymongo import MongoClient

mongo = None
db = None

def init_db():
    global mongo, db
    mongo = MongoClient("mongodb://localhost:27017")
    db = mongo["aegis_db"]

