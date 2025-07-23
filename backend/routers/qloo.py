from enum import Enum
from fastapi import APIRouter, Depends
from typing import Annotated
from .users import get_user_logged_in
import requests
import os
from requests.auth import HTTPBasicAuth
import json

router = APIRouter()

key: str = os.environ.get("QLOO_API_KEY")
url: str = "https://hackathon.api.qloo.com/search"


class SortTypes(str, Enum):
    genre: str
    influenced_by_artist_name: str


@router.get("/qloo/music-recs/albums/")
def get_music_recommendations_album(genre: str, user: Annotated[str, Depends(get_user_logged_in)]):
    try:
        headers = {"accept": "application/json", 'x-api-key': key}
        params = {
            "filter.tags": f"urn:tag:genre:{genre}",
            "filter.type": "urn:entity:album"
        }
        response = requests.get(url, headers=headers, params=params)
        return response.json()["results"]
    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}


@router.get("/qloo/music-recs/artists")
def get_music_recommendations_artist(genre: str, user: Annotated[str, Depends(get_user_logged_in)]):
    try:
        headers = {"accept": "application/json", 'x-api-key': key}
        params = {
            "filter.tags": f"urn:tag:genre:{genre}",
            "filter.type": "urn:entity:artist"
        }
        response = requests.get(url, headers=headers, params=params)
        return response.json()["results"]
    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}
