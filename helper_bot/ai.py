from langchain import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    SystemMessage
)

# langchain 세팅
llm = ChatOpenAI(temperature=0.8)

loader = TextLoader("./data_kakaosync.txt")
loader.load()

system_message = "assistant는 안내봇으로서 동작한다."
system_message_prompt = SystemMessage(content=system_message)

human_template = (
"""
질문: {message}
---
대답 형태:
- markdown 문법 활용
- 핵심 내용은 찐하게 표시
- 정중한 어투
- 간결한 표현
"""
)
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chain_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])
chain = LLMChain(llm=llm, prompt=chain_prompt)

def ai_request(message):
  # API 호출
  response_text = chain.run(
    message=message
  )

  # Return
  return response_text
