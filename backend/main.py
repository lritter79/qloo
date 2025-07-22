from fastapi import FastAPI
from routers import users, qloo

app = FastAPI()

app.include_router(users.router)
app.include_router(qloo.router)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
