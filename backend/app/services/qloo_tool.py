from enum import Enum
import httpx
from typing import Any
from .. import constants


class CategoryEnum(str, Enum):
    ARTIST = "artist"
    BOOK = "book"
    BRAND = "brand"
    DESTINATION = "destination"
    MOVIE = "movie"
    PERSON = "person"
    PLACE = "place"
    PODCAST = "podcast"
    TV_SHOW = "tv_show"
    VIDEO_GAME = "video_game"


class QlooToolHandler:
    insights_url = "https://hackathon.api.qloo.com/v2/insights"
    search_url = "https://hackathon.api.qloo.com/search"

    def __init__(self, api_key: str):
        self._key = api_key

    def get_schema(self) -> list[dict]:
        merged_dict = {**constants.FILTER_PARAMS, **
                       constants.SIGNAL_PARAMS, **constants.OUTPUT_PARAMS}
        merged_dict_defs = {**constants.FILTER_PARAM_DESCRIPTIONS, **
                            constants.OUTPUT_PARAM_DESCRIPTIONS, **constants.SIGNAL_PARAM_DESCRIPTIONS}
        return [
            {
                "name": "get_music_recommendations_artist",
                "description": "Fetch music artist recommendations based on Qloo tag filters",
                "parameters": {
                    "type": "object",
                    "properties": {
                            "qlooParams": {
                                "type": "object",
                                "description": "Dictionary of optional music tag filters. Note about the 'tag_artist_qloo' parameter, it applies to the vocal range of given artist or singer in a band, not what the artist is called or what they sound like.",
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

            },
            {

                "name": "get_insights",
                "description": "Fetch insights based on Qloo tag filters",
                "parameters": {
                        "type": "object",
                        "properties": {
                            "qlooParams": {
                                "type": "object",
                                "description": "Dictionary of optional tag filters, signals, and output params for insights. 'filter_type' is required for this tool to run. Note that the 'filter.location' param is for Filter by a WKT POINT, POLYGON, MULTIPOLYGON or a single Qloo ID for a named urn:entity:locality.and filter.location.query is for filtering by place names",
                                "properties": {
                                    tag: {
                                        "type": "array",
                                        "items": {"type": "string"},
                                        "description": f"{merged_dict_defs[tag]}"
                                    } for tag in list(merged_dict.keys())
                                },
                                "additionalProperties": False
                            }
                        },
                    "required": ["qlooParams"]
                }
            }

        ]

    async def dispatch(self, function_name: str, arguments: dict[str, Any]):
        if function_name == "get_music_recommendations_artist":
            return await self.get_music_recommendations_artist(arguments["qlooParams"])
        elif function_name == "get_insights":
            return await self.get_insights(arguments["qlooParams"])
        else:
            # Handle unknown function calls
            print(
                f"Unknown function call: {function_name} with arguments: {arguments}")
        return {"error": f"No handler for {function_name}"}

    async def get_music_recommendations_artist(self, qlooParams: dict[str, Any], take=5):
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
            "filter.type": "urn:entity:artist",
            "take": take
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self._url_search, headers=headers, params=params)
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            return {"error": str(e)}

    async def get_qloo_entity(self, filterType: CategoryEnum, query: str, take=1):
        headers = {
            "accept": "application/json",
            "x-api-key": self._key
        }

        params = {
            "filter.type": f"urn:entity:{filterType.value}",
            "query": query,
            "take": take
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self._url_search, headers=headers, params=params)
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            return {"error": str(e)}

    async def get_insights(self, qlooParams: dict[str, Any]):
        headers = {
            "accept": "application/json",
            "x-api-key": self._key
        }

        params = {

        }

        merged_dict = {**constants.FILTER_PARAMS, **
                       constants.SIGNAL_PARAMS, **constants.OUTPUT_PARAMS}
        for param_name, param_value in merged_dict.items():
            values = qlooParams.get(param_name)
            if values:
                params[f"{param_value}"] = ",".join(
                    [f"{v}" for v in values])
        params["take"] = qlooParams.get("take", 5)
        # for param_name, urn_prefix in constants.OUTPUT_PARAMS.items():
        #     value = qlooParams.get(param_name)
        #     if value is not None:
        #         output_params.append(f"{urn_prefix}:{value}")
        # signal_params = []
        # for param_name, urn_prefix in constants.SIGNAL_PARAMS.items():
        #     value = qlooParams.get(param_name)
        #     if value is not None:
        #         signal_params.append(f"{urn_prefix}:{value}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.insights_url, headers=headers, params=params)
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            print("Error: ", e)
            return {"message": "failed"}
