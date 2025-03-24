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
    pathOfFiles: z.array(z.string()),
    message: z.string(),
  }),
  execute: async ({ pathOfFiles, message }) => {
    let response = "";
    try {
      try {
        let contentLength = 0;
        for (const path of pathOfFiles) {
          const headResponse = await axios.head(path);
          contentLength += parseInt(headResponse.headers["content-length"], 10);
        }
        if (contentLength > 1000000) {
          const { data } = await axios.post(
            "https://codex4learner.com/api/v1/extract-relevant-text",
            {
              prompt: message,
              path_of_files: pathOfFiles,
            }
          );
          return data.response || "No content received from PDF parser";
        } else {
          for (const path of pathOfFiles) {
            const pdfBuffer = await downloadPDF(path);
            response += await extractTextFromPDF(pdfBuffer, message);
          }
        }
      } catch (error: any) {
        return `Failed to process PDF: ${error.message}`;
      }
      return response;
    } catch (error: any) {
      return `PDF processing error: ${error.message}`;
    }
  },
});
