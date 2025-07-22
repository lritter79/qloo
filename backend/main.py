import os
from fastapi import FastAPI
from routers import users, qloo
from fastapi.middleware.cors import CORSMiddleware

env = os.getenv("ENVIRONMENT", default="development")

# Set origins based on environment
if env == "production":
    allowed_origins = [
        "https://yourdomain.com",
        "https://www.yourdomain.com",
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
