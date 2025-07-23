import openai
import json
from typing import Any
from .qloo_tool import QlooToolHandler


class OpenAIService:
    def __init__(self, api_key: str, model: str = "gpt-4-turbo", qloo_api_key: str = ""):
        openai.api_key = api_key
        self.model = model
        self.tool_handler = QlooToolHandler(qloo_api_key)

    async def chat_with_tools(self, user_prompt: str):
        response = openai.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": user_prompt}],
            tools=[self.tool_handler.get_schema()],
            tool_choice="auto"
        )

        tool_calls = response.get("choices", [])[0].get(
            "message", {}).get("tool_calls")
        if tool_calls:
            tool_call = tool_calls[0]
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            return await self.tool_handler.dispatch(name, args)

        return response.output_text
