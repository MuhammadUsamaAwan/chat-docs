import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';

function getDocumentLoader(filePath: string) {
  const fileType = filePath.split('.').pop();
  let loader;
  switch (fileType) {
    case 'pdf':
      loader = new PDFLoader(filePath, {
        splitPages: false,
      });
      return loader;
    case 'epub':
      loader = new EPubLoader(filePath, {
        splitChapters: false,
      });
      return loader;
    case 'docx':
      loader = new DocxLoader(filePath);
      return loader;
    case 'txt':
      loader = new TextLoader(filePath);
      return loader;
    case 'md':
      loader = new TextLoader(filePath);
      return loader;
    case 'json':
      loader = new TextLoader(filePath);
      return loader;
    case 'csv':
      loader = new CSVLoader(filePath);
      return loader;
    default:
      loader = new UnstructuredLoader(filePath, {
        apiUrl: 'http://127.0.0.1:8001/general/v0/general',
      });
      return loader;
  }
}

export function loadDocument(filePath: string) {
  const loader = getDocumentLoader(filePath);
  return loader.loadAndSplit();
}
