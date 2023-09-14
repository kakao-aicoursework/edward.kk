import os
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

async def ai_request(message):
  system_instruction = f"assistant는 안내봇으로서 동작한다."

  messages = [
     {"role": "system", "content": system_instruction},
     {"role": "user", "content": message},
  ]

  # API 호출
  response = await openai.ChatCompletion.acreate(
    model="gpt-3.5-turbo",
    messages=messages
  )
  response_text = response['choices'][0]['message']['content']

  # Return
  return response_text
