import path from 'path';
import { pathToFileURL } from 'url';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
/*
This is the API route of parse-pdf which handles our request for parsing the text in the resume 
and send the extracted text back again to page.js for further analysis by the GEMINI model in
the backend.
*/
export async function POST(request) {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerFile = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerFile).href;

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const uint8Array = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjs.getDocument({ data: uint8Array, disableWorker: true });
    const pdfDocument = await loadingTask.promise;

    const pages = [];
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      pages.push(pageText);
    }

    return NextResponse.json({ text: pages.join('\n\n') });

  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF: ' + error.message },
      { status: 500 }
    );
  }
}