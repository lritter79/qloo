from fastapi import APIRouter, Depends, HTTPException, Response, status
from app.models import RefreshToken, User, Login
from db.supabase import create_supabase_client
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
import jwt
import os

router = APIRouter()

secret: str = os.environ.get("SUPABASE_JWT_SECRET")

# Initialize supabase client
supabase = create_supabase_client()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def validate_jwt(
    res: Response,
    cred: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
):

    if cred is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer authentication required",
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )

    try:
        jwt_result = jwt.decode(
            cred.credentials,
            secret,
            audience="authenticated",
            algorithms=["HS256"],
        )

        return jwt_result
    except jwt.exceptions.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )


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

@router.post("/users/signup")
def create_user(user: User):
    try:
        user_email = user.email.lower()

        # Add user to users table
        response = supabase.auth.sign_up(
            {
                "email": user_email,
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
        raise HTTPException(status_code=e.status, detail=e.message)


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
            return response
        else:
            return {"message": "User login failed"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=500, detail=e.message)


@router.get("/users/me")
def get_user(userData: Annotated[dict, Depends(get_user_logged_in)]):
    return userData['user']


@router.get("/users/refresh")
def refresh(refreshToken: RefreshToken, jwt: Annotated[dict, Depends(validate_jwt)]):
    try:

        response = supabase.auth.refresh_session(refreshToken.refreshToken)
        return response

    except Exception as e:
        print("Error: ", e)
        return {"message": f"Refresh failed: {e}"}


@router.post("/users/logout")
def logout(token: Annotated[str, Depends(oauth2_scheme)]):

    try:

        response = supabase.auth.admin.sign_out(token)
        return "Logout Successful"

    except Exception as e:
        print("Error: ", e)
        return {"message": f"User logout failed: {e}"}
