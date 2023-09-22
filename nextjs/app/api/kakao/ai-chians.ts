import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';

export const intentChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    `
Your job is to select one intent from the <intent_list>.

<intent_list>
free talk: User is not seeking specific information or assistance but is open to engaging in a conversation on various topics. 
question: A specific question, or how to use a feature
</intent_list>

User: {message}
Intent:
  `.trim(),
  ),
  new ChatOpenAI({
    temperature: 0.1,
    maxTokens: 200,
    modelName: 'gpt-3.5-turbo',
  }),
]);

export const questionChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    `
Answer the question based only on the following context:
{context}

Question: {question}
  `.trim(),
  ),
  new ChatOpenAI({
    temperature: 0,
    streaming: true,
    modelName: 'gpt-3.5-turbo',
    verbose: true,
  }),
]);

export const freeTalkChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    `
---
너의 이름은 챗봇서비스이고, 나의 AI 비서야. 친절하고 명랑하게 대답해줘. 고민을 말하면 공감해줘.
---
{message}
  `.trim(),
  ),
  new ChatOpenAI({
    temperature: 1,
    maxTokens: 200,
    modelName: 'gpt-3.5-turbo',
    streaming: true,
  }),
]);

export const bugChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    `
---
너의 이름은 챗봇서비스이고 응답에 버그가 발생되었어. 친절하고 명랑하게 대답해줘.
---
{message}
  `.trim(),
  ),
  new ChatOpenAI({
    temperature: 0.1,
    maxTokens: 200,
    modelName: 'gpt-3.5-turbo',
    streaming: true,
  }),
]);
