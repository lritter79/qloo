from fastapi import APIRouter, Depends
from typing import Annotated
from .users import get_user_logged_in

router = APIRouter()


# Create a new user

@router.get("/qloo")
def get_product_recommendations(user: Annotated[str, Depends(get_user_logged_in)]):
    try:
        return "d"
    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}
