from motor.motor_asyncio import AsyncIOMotorClient

db = None

async def init_db():
    global db
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["aegis"]
    print("DB initialized:", db)

