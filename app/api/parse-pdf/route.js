import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const pdfParse = (await import("pdf-parse")).default;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await pdfParse(buffer);

    const cleanedText = data.text.replace(/\s+/g, " ").trim();

    return NextResponse.json({
      text: cleanedText,
      pages: data.numpages,
    });

  } catch (error) {
    console.error("PDF parsing error:", error);

    return NextResponse.json(
      {
        error: "Failed to parse PDF",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
/*import path from 'path';
import { pathToFileURL } from 'url';
*/
/*
This is the API route of parse-pdf which handles our request for parsing the text in the resume 
and send the extracted text back again to page.js for further analysis by the GEMINI model in
the backend.
*/
/*
import * as pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
*/
/*
 API route to parse PDF resume and return extracted text
*/
/*
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // 🔴 Validate file
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // 🔹 Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔹 Parse PDF
    const data = await pdfParse(buffer);

    // 🔹 Clean text (optional but recommended)
    const cleanedText = data.text
      .replace(/\s+/g, " ")
      .trim();

    // 🔹 Return extracted text
    return NextResponse.json({
      text: cleanedText,
      pages: data.numpages
    });

  } catch (error) {
    console.error("PDF parsing error:", error);

    return NextResponse.json(
      {
        error: "Failed to parse PDF",
        details: error.message
      },
      { status: 500 }
    );
  }
}
*/
