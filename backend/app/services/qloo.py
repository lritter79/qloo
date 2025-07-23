from typing import Any, List, Optional
import httpx

class QlooService:
    _key: str
    _url_search: str

    def __init__(self, key: str):
        self._key = key
        self._url_search = "https://hackathon.api.qloo.com/search"

    async def get_music_recommendations_artist(self, qlooParams: dict[str, Any]):
        try:
            headers = {
                "accept": "application/json",
                "x-api-key": self._key
            }

            # Mapping query param names to their URN tag prefix
            tag_prefix_map = {
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

            for param_name, urn_prefix in tag_prefix_map.items():
                values = qlooParams.get(param_name)
                if values:
                    tag_filters.extend([f"{urn_prefix}:{v}" for v in values])

            params = {
                "filter.tags": ",".join(tag_filters),
                "filter.type": "urn:entity:artist"
            }

            async with httpx.AsyncClient() as client:
                response = await client.get(self._url_search, headers=headers, params=params)
                response.raise_for_status()
                return response.json().get("results", [])

        except Exception as e:
            print("Error: ", e)
            return {"message": "failed"}
