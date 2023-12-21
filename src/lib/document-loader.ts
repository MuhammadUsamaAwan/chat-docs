import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';

async function pdfLoader(path: string) {
  const loader = new PDFLoader(path);
  return loader.load();
}

async function csvLoader(path: string) {
  const loader = new CSVLoader(path);
  return loader.load();
}

async function jsonLoader(path: string) {
  const loader = new JSONLoader(path);
  return loader.load();
}

async function docxLoader(path: string) {
  const loader = new DocxLoader(path);
  return loader.load();
}

async function pptxLoader(path: string) {
  const loader = new PPTXLoader(path);
  return loader.load();
}

async function textLoader(path: string) {
  const loader = new TextLoader(path);
  return loader.load();
}

async function unstructuredLoader(path: string) {
  const loader = new UnstructuredLoader(path, {
    apiUrl: 'http://127.0.0.1:8001/general/v0/general',
  });
  return loader.load();
}

export async function loadDocument(path: string) {
  const extension = path.split('.').pop();
  if (!extension) throw new Error('Unable to determine file extension');
  switch (extension) {
    case 'pdf':
      return pdfLoader(path);
    case 'csv':
      return csvLoader(path);
    case 'json':
      return jsonLoader(path);
    case 'docx':
      return docxLoader(path);
    case 'pptx':
      return pptxLoader(path);
    case 'txt':
      return textLoader(path);
    default:
      return unstructuredLoader(path);
  }
}
