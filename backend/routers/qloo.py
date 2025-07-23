from enum import Enum
from fastapi import APIRouter, Depends, Query
from typing import Annotated, Optional, List
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
    influence_genre: str


@router.get("/qloo/music-recs/albums/")
def get_music_recommendations_album(genre: str, influenced_by_artist_name: str, influence_genre: str, user: Annotated[str, Depends(get_user_logged_in)]):
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
def get_music_recommendations_artist(
    user: Annotated[str, Depends(get_user_logged_in)],
    genre: Optional[List[str]] = Query(default=None),
    influenced_by_artist_name: Optional[List[str]] = Query(default=None),
    influence_genre: Optional[List[str]] = Query(default=None),
    tag_genre: Optional[List[str]] = Query(default=None),
    tag_audience_qloo: Optional[List[str]] = Query(default=None),
    tag_music_qloo: Optional[List[str]] = Query(default=None),
    tag_style_qloo: Optional[List[str]] = Query(default=None),
    tag_characteristic_qloo: Optional[List[str]] = Query(default=None),
    tag_influence_qloo: Optional[List[str]] = Query(default=None),
    tag_influenced_by_qloo: Optional[List[str]] = Query(default=None),
    tag_instrument_qloo: Optional[List[str]] = Query(default=None),
    tag_theme_qloo: Optional[List[str]] = Query(default=None),
    tag_genre_qloo: Optional[List[str]] = Query(default=None),
    tag_subgenre_qloo: Optional[List[str]] = Query(default=None),
    tag_artist_qloo: Optional[List[str]] = Query(default=None),
    operator_filter_exclude_tags: Optional[str] = "intersection",
):
    try:
        headers = {
            "accept": "application/json",
            "x-api-key": key
        }

        # Mapping query param names to their URN tag prefix
        tag_prefix_map = {
            "genre": "urn:tag:genre",
            "influenced_by_artist_name": "urn:tag:influenced_by:qloo",
            "influence_genre": "urn:tag:influence:qloo",
            "tag_genre": "urn:tag:genre",
            "tag_audience_qloo": "urn:tag:audience:qloo",
            "tag_music_qloo": "urn:tag:music:qloo",
            "tag_style_qloo": "urn:tag:style:qloo",
            "tag_characteristic_qloo": "urn:tag:characteristic:qloo",
            "tag_influence_qloo": "urn:tag:influence:qloo",
            "tag_influenced_by_qloo": "urn:tag:influenced_by:qloo",
            "tag_instrument_qloo": "urn:tag:instrument:qloo",
            "tag_theme_qloo": "urn:tag:theme:qloo",
            "tag_genre_qloo": "urn:tag:genre:qloo",
            "tag_subgenre_qloo": "urn:tag:subgenre:qloo",
            "tag_artist_qloo": "urn:tag:artist:qloo",
        }

        tag_filters = []
        func_locals = locals()

        for param_name, urn_prefix in tag_prefix_map.items():
            values = func_locals.get(param_name)
            if values:
                tag_filters.extend([f"{urn_prefix}:{v}" for v in values])

        params = {
            "filter.tags": ",".join(tag_filters),
            "filter.type": "urn:entity:artist"
        }

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json().get("results", [])

    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}
