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
        messages = [{"role": "user", "content": user_prompt}]
        completion = openai.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=[self.tool_handler.get_schema()],
            tool_choice="auto"
        )

        tool_calls = completion.choices[0].message.tool_calls
        if tool_calls:
            tool_call = tool_calls[0]
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)

            result = await self.tool_handler.dispatch(name, args)
            # append model's function call message
            messages.append(completion.choices[0].message)
            messages.append({                               # append result message
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result)
            })

            completion_2 = openai.chat.completions.create(
                model="gpt-4.1",
                messages=messages,
                tools=[self.tool_handler.get_schema()],
            )
            return completion_2.choices[0].message.content

        return completion.choices[0].message.content
