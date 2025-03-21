import OpenAI from "openai";
import axios from "axios";
import { tool } from "ai";
import { z } from "zod";

const extractTextFromPDF = async (fileBuffer: Buffer, message: string) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = await client.files.create({
    file: new File([fileBuffer], "document.pdf", { type: "application/pdf" }),
    purpose: "user_data",
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            file: {
              file_id: file.id,
            },
          },
          {
            type: "text",
            text: message || "Summarize this document in detail",
          },
        ],
      },
    ],
  });

  return (
    completion.choices[0].message.content || "No content received from OpenAI"
  );
};

const downloadPDF = async (url: string) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
};

export const answerFormPDF = tool({
  description: "For reading multiple PDFs and returning links",
  parameters: z.object({
    allPDFUrls: z.array(z.string()),
    message: z.string(),
  }),
  execute: async ({ allPDFUrls, message }) => {
    let response = "";
    try {
      for (const pdfUrl of allPDFUrls) {
        try {
          const headResponse = await axios.head(pdfUrl);
          const contentLength = parseInt(
            headResponse.headers["content-length"],
            10
          );

          if (contentLength > 10 * 1000000) {
            // 10 * 1000000 = 10MB
            const { data } = await axios.post(
              "http://13.234.67.194/api/convert-large-pdf-to-text",
              {
                pdfUrl,
              }
            );
            return data.response || "No content received from PDF parser";
          } else if (contentLength > 3 * 1000000) {
            // 3 * 1000000 = 3MB
            const { data } = await axios.post(
              "http://13.234.67.194/api/convert-pdf-to-text",
              {
                pdfUrl,
              }
            );
            return data.response || "No content received from PDF parser";
          } else if (contentLength > 100) {
            // 1000000 = 1MB
            const { data } = await axios.post(
              "http://13.234.67.194/api/convert-pdf-to-markdown",
              {
                pdfUrl,
              }
            );
            return data.response || "No content received from PDF parser";
          } else {
            const pdfBuffer = await downloadPDF(pdfUrl);
            response = await extractTextFromPDF(pdfBuffer, message);
          }
        } catch (error: any) {
          return `Failed to process PDF: ${error.message}`;
        }
      }
      return response;
    } catch (error: any) {
      return `PDF processing error: ${error.message}`;
    }
  },
});
