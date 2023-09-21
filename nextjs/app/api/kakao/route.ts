import { NextRequest } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser, StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence, RunnablePassthrough } from 'langchain/schema/runnable';
import { PromptTemplate } from 'langchain/prompts';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { Document } from 'langchain/document';

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
  return docs.map((doc) => doc.pageContent).join('\n');
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
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  // vector
  const loader = new DirectoryLoader('assets', {
    '.txt': (path) => new TextLoader(path),
  });
  const docs = await loader.load();

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
  // const resultOne = await vectorStore.similaritySearch(currentMessageContent, 1);
  // console.log(resultOne);

  // const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
  //   collectionName: 'a-test-collection',
  //   url: 'http://localhost:8000', // Optional, will default to this value
  // });
  // const response = await vectorStore.similaritySearch('카카오싱크', 1);
  // console.log(response);

  const retriever = vectorStore.asRetriever();

  // chain
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0.1,
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

  const result = await chain.invoke(currentMessageContent);
  console.log(result);

  // const stream = await chain.stream({
  //   question: currentMessageContent,
  // });

  // return new StreamingTextResponse(stream);

  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(result));
      controller.close();
    },
  });
  return new Response(customReadable as BodyInit, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
