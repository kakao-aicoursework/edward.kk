from langchain import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    SystemMessage
)

# langchain 세팅
llm = ChatOpenAI(temperature=0.8)
system_message = "assistant는 안내봇으로서 동작한다."
system_message_prompt = SystemMessage(content=system_message)

human_template = ("질문: {message}")
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
