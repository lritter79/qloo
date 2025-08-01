import os
from fastapi import FastAPI
from app.routers import users, qloo, chat
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
env = os.getenv("ENVIRONMENT", default="development")

# Set origins based on environment
if env == "production":
    allowed_origins = [
        "https://levon-ritter-qloo-hackathon.com",
        "https://www.levon-ritter-qloo-hackathon.com",
        "https://prod.levon-ritter-qloo-hackathon.com",
        "https://www.prod.levon-ritter-qloo-hackathon.com",
        "http://localhost",  # Add this for health checks
        "http://127.0.0.1",  # Add this too
    ]
elif env == "staging":
    allowed_origins = [
        "https://staging.yourdomain.com",
        "http://localhost:3000",
    ]
else:  # development
    allowed_origins = [
        "http://localhost:4200",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
    ]


app = FastAPI()

app.include_router(users.router)
app.include_router(qloo.router)
app.include_router(chat.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
