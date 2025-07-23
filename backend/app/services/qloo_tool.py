import httpx
from typing import Any


class QlooToolHandler:
    def __init__(self, api_key: str, search_url: str = "https://hackathon.api.qloo.com/search"):
        self._key = api_key
        self._url_search = search_url

    def get_schema(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": "get_music_recommendations_artist",
                "description": "Fetch music artist recommendations based on Qloo tag filters",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "qlooParams": {
                            "type": "object",
                            "description": "Dictionary of optional music tag filters",
                            "properties": {
                                tag: {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": f"{tag.replace('_', ' ').title()} tags"
                                } for tag in [
                                    "tag_genre", "tag_audience_qloo", "tag_music_qloo", "tag_style_qloo",
                                    "tag_characteristic_qloo", "tag_influence_qloo", "tag_influenced_by_qloo",
                                    "tag_instrument_qloo", "tag_theme_qloo", "tag_genre_qloo", "tag_subgenre_qloo",
                                    "tag_artist_qloo"
                                ]
                            },
                            "additionalProperties": False
                        }
                    },
                    "required": ["qlooParams"]
                }
            }
        }

    async def dispatch(self, function_name: str, arguments: dict[str, Any]):
        if function_name == "get_music_recommendations_artist":
            return await self.get_music_recommendations_artist(arguments["qlooParams"])
        return {"error": f"No handler for {function_name}"}

    async def get_music_recommendations_artist(self, qlooParams: dict[str, Any]):
        headers = {
            "accept": "application/json",
            "x-api-key": self._key
        }

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

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self._url_search, headers=headers, params=params)
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            return {"error": str(e)}
