import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { readFile, utils } from 'xlsx';

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

async function xlsxLoader(path: string) {
  const workbook = readFile(path);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('Unable to read file, No sheet found');
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) throw new Error('Unable to read file, No worksheet found');
  const csv = utils.sheet_to_csv(worksheet);
  const csvBuffer = Buffer.from(csv, 'utf-8');
  const csvBlob = new Blob([csvBuffer]);
  const loader = new CSVLoader(csvBlob);
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
    case 'xlsx':
      return xlsxLoader(path);
    default:
      throw new Error('Unsupported file type');
  }
}
