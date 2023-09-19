import { NextRequest, NextResponse } from 'next/server';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const chat = new ChatOpenAI({
  streaming: true,
  temperature: 0.8,
  maxRetries: 1,
});

const systemTemplate = `You are a helpful assistant that translates {input_language} to {output_language}.`;
const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(systemTemplate);
const humanTemplate = `{text}
---
rule:
- translate accurately
- explain how you translate it
- step by step

template:
'''
<b>translation</b>

Explanation
'''

example: 
input: "아침은 먹었니?"
answer: 
"""
<b>Did you eat breakfast?</b>

Explanation:
- 아침 (achim) means breakfast.
- 먹었니 (meogeotni) is a contraction of the verb 먹었니까 (meogeotnikka), which means "did you eat?" or "have you eaten?" The ending -니 (ni) is a question marker.
- Therefore, the sentence 아침은 먹었니? (achimeun meogeotni?) translates to "Did you eat breakfast?"
"""
`;
const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);
const chatPrompt = ChatPromptTemplate.fromPromptMessages([systemMessagePrompt, humanMessagePrompt]);

const chain = chatPrompt.pipe(chat).pipe(new BytesOutputParser());

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { messages } = await req.json();
    const text = messages.at(-1).content;

    const stream = await chain.stream({
      input_language: 'Korean',
      output_language: 'English',
      text,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
