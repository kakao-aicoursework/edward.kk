import { NextRequest, NextResponse } from 'next/server';
import { Message, StreamingTextResponse } from 'ai';

import { BytesOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence, RunnablePassthrough } from 'langchain/schema/runnable';

import { bugChain, freeTalkChain, intentChain, questionChain } from './ai-chians';
import { getDocRetrieve } from './ai-vector';
import { PromptTemplate } from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';

export const runtime = 'nodejs';

const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};
/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body.messages ?? []) as Message[];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // chain
    let streamChain: RunnableSequence;

    const { content } = await intentChain.invoke({
      message: currentMessageContent,
    });

    console.log(`>>>> ${content} <<<<`);

    switch (content) {
      case 'free talk':
        streamChain = RunnableSequence.from([freeTalkChain, new BytesOutputParser()]);
        break;
      case 'question':
        const retrieve = await getDocRetrieve();

        streamChain = RunnableSequence.from([
          {
            context: retrieve,
            question: new RunnablePassthrough(),
          },
          questionChain,
          new BytesOutputParser(),
        ]);
        break;
      default:
        streamChain = RunnableSequence.from([bugChain, new BytesOutputParser()]);
        break;
    }

    const stream = await streamChain.stream({
      message: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
