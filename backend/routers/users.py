from fastapi import APIRouter
from app.models import User, Login
from db.supabase import create_supabase_client

router = APIRouter()

# Initialize supabase client
supabase = create_supabase_client()


# Create a new user

@router.post("/user/sign-up")
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


@router.post("/user/login")
def create_user(login: Login):
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
            return {"message": "User login successfully"}
        else:
            return {"message": "User login failed"}
    except Exception as e:
        print("Error: ", e)
        return {"message": f"User login failed: {e}"}


@router.post("/user/logout")
def logout():
    try:

        response = supabase.auth.sign_out()

        # Check if user was added
        if response:
            return {"message": "User logout successfully"}
        else:
            return {"message": "User login failed"}
    except Exception as e:
        print("Error: ", e)
        return {"message": f"User logout failed: {e}"}
