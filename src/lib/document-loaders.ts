import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export async function pdfLoader(path: string) {
  const loader = new PDFLoader(path);
  return loader.load();
}
