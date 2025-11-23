from pymongo import MongoClient



def init_db():
    mongo = MongoClient("mongodb://localhost:27017")
    db = mongo["aegis_db"]
    return db


