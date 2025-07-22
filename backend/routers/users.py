from fastapi import APIRouter, Depends, HTTPException, status
from app.models import User, Login
from db.supabase import create_supabase_client
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

router = APIRouter()

# Initialize supabase client
supabase = create_supabase_client()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user_logged_in(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        response = supabase.auth.get_user(token)
        if response is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"})
        else:
            return {'user': response.user, 'token': token}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Get user failed: {e}",
            headers={"WWW-Authenticate": "Bearer"})


# Create a new user

@router.post("/users/sign-up")
def create_user(user: User):
    try:
        user_email = user.email.lower()

        # Add user to users table
        response = supabase.auth.sign_up(
            {
                "email": user.email,
                "password": user.password,
                "options": {"data": {"full_name": user.name}},

            }
        )

        # Check if user was added
        if response:
            return {"message": "User created successfully"}
        else:
            return {"message": "User creation failed"}
    except Exception as e:
        print("Error: ", e)
        return {"message": f"User creation failed: {e}"}


@router.post("/users/login")
def login(login: Login):
    try:
        # Check if user already exists

        # Add user to users table
        response = supabase.auth.sign_in_with_password(
            {
                "email": login.email,
                "password": login.password,
            }
        )

        # Check if user was added
        if response:
            return {"message": "User login successfully", "token": response}
        else:
            return {"message": "User login failed"}
    except Exception as e:
        print("Error: ", e)
        return {"message": f"User login failed: {e}"}


@router.get("/users/me")
def get_user(userData: Annotated[dict, Depends(get_user_logged_in)]):
    return userData['user']


@router.put("/users/logout")
def logout(userData: Annotated[dict, Depends(get_user_logged_in)]):

    try:

        response = supabase.auth.admin.sign_out(userData['token'])
        return "Logout Successful"

    except Exception as e:
        print("Error: ", e)
        return {"message": f"User logout failed: {e}"}
