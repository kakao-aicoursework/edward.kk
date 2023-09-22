import { Document } from 'langchain/document';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const getDocsVectorStore = async () => {
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
    new OpenAIEmbeddings({
      verbose: true,
    }),
  );

  return vectorStore;
};
