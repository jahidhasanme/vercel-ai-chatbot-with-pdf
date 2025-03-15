import OpenAI from "openai";
import axios from "axios";
import { tool } from "ai";
import { z } from "zod";
import fs from "fs";

const extractTextFromPDF = async (
  filePath: string,
  message: string
): Promise<string> => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = await client.files.create({
    file: fs.createReadStream(filePath),
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

const downloadPDF = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
};

export const answerFormPDF = tool({
  description: "For reading multiple PDFs and returning links",
  parameters: z.object({
    allPDFUrls: z.array(z.string()),
    message: z.string(),
  }),
  execute: async ({ allPDFUrls, message }) => {
    let response = "";
    for (const pdfUrl of allPDFUrls) {
      const pdfBuffer = await downloadPDF(pdfUrl);

      const tempFilePath = process.cwd() + "/temp.pdf";
      fs.writeFileSync(tempFilePath, pdfBuffer);

      response = await extractTextFromPDF(tempFilePath, message);

      fs.unlinkSync(tempFilePath);
    }

    return response;
  },
});
