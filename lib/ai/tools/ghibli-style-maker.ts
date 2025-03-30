import axios from "axios";
import { tool } from "ai";
import { z } from "zod";

export const ghibliStyleMaker = tool({
  description: "This is ghibli style maker tool",
  parameters: z.object({
    filePath: z.string(),
    message: z.string(),
  }),
  execute: async ({ filePath, message }) => {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/v1/ghibli-style-maker", //"https://codex4learner.com/api/v1/ghibli-style-maker",
        {
          prompt: message,
          image_url: filePath,
        }
      );
      return (
        data.data.response ||
        "No content received from ghibli style maker server"
      );
    } catch (error: any) {
      return `Ghibli style maker processing error: ${error.message}`;
    }
  },
});
