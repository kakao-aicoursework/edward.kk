import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser, StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence, RunnablePassthrough } from 'langchain/schema/runnable';
import { PromptTemplate } from 'langchain/prompts';

import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from 'langchain/text_splitter';

import { z } from 'zod';
import { createMetadataTaggerFromZod } from 'langchain/document_transformers/openai_functions';

// export const runtime = 'edge';
export const runtime = 'nodejs';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const serializeDocs = (docs: Document[]) => {
  const text = docs.map((doc) => doc.pageContent).join('\n');
  console.log('============');
  console.log(text);
  console.log('============');
  return text;
};

const TEMPLATE = `Answer the question based only on the following context:
{context}

Question: {question}`;

/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // vector
    const loader = new DirectoryLoader('assets', {
      '.txt': (path) => new TextLoader(path),
    });
    const rawDocs = await loader.load();

    const markDownSplitter = new MarkdownTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const markdownSplittedDocs = await markDownSplitter.splitDocuments(rawDocs);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      markdownSplittedDocs,
      new OpenAIEmbeddings(),
    );

    const retriever = vectorStore.asRetriever();

    // chain
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      streaming: true,
      temperature: 0,
    });

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(serializeDocs),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const stream = await chain.stream(currentMessageContent);
    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
