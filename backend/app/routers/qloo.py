from enum import Enum
from fastapi import APIRouter, Depends, Query
from typing import Annotated, Optional, List 
from app.services.qloo import QlooService
from .users import validate_jwt
import requests
import os
from requests.auth import HTTPBasicAuth
import json

router = APIRouter()

key: str = os.environ.get("QLOO_API_KEY")
qlooService: QlooService = QlooService(key)


class SortTypes(str, Enum):
    genre: str
    influenced_by_artist_name: str
    influence_genre: str


@router.get("/qloo/music-recs/albums/")
def get_music_recommendations_album(
    jwt: Annotated[dict, Depends(validate_jwt)],
    tag_genre: Optional[List[str]] = Query(default=None),

):
    try:
        headers = {
            "accept": "application/json",
            "x-api-key": key
        }

        # URN prefix map for album-relevant tag filters
        tag_prefix_map = {
            "tag_genre": "urn:tag:genre",

        }

        tag_filters = []
        func_locals = locals()

        for param_name, urn_prefix in tag_prefix_map.items():
            values = func_locals.get(param_name)
            if values:
                tag_filters.extend([f"{urn_prefix}:{v}" for v in values])

        params = {
            "filter.tags": ",".join(tag_filters),
            "filter.type": "urn:entity:album"
        }

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json().get("results", [])

    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}


@router.get("/qloo/music-recs/artists")
async def get_music_recommendations_artist(
    jwt: Annotated[dict, Depends(validate_jwt)],
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
        func_locals = locals()

        res = await qlooService.get_music_recommendations_artist(func_locals)
        return res
    except Exception as e:
        print("Error: ", e)
        return {"message": "failed"}
