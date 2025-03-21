import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      {
        message: "File type should be PDF, JPEG, or PNG",
      }
    ).refine((file) => ["application/pdf"].includes(file.type) ? true : file.size <= 5 * 1024 * 1024, {
      message: "Image file size should be less than 5MB",
    })
    .refine((file) => file.size <= 32 * 1024 * 1024, {
      message: "PDF file size should be less than 32MB",
    })
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const filename = `${uuidv4()}-${(file as File).name}`;
    const fileBuffer = await file.arrayBuffer();

    // if (file.type === "application/pdf") {
    //   const responseData: any[] = [];
    //   const pdfBase64 = Buffer.from(fileBuffer).toString("base64");

    //   const response = await fetch("http://13.127.114.227:3002/convert", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ pdfBase64 }),
    //   });

    //   if (!response.ok) {
    //     console.log(response)
    //     throw new Error("PDF conversion failed");
    //   }

    //   const { images } = await response.json();

    //   if (!images || !images.length) {
    //     throw new Error("No images returned from conversion");
    //   }

    //   for (let i = 0; i < images.length; i++) {
    //     const command = new PutObjectCommand({
    //       Bucket: process.env.AWS_S3_BUCKET_NAME!,
    //       Key: filename + i + ".png",
    //       Body: Buffer.from(images[i], "base64"),
    //       ContentType: "image/png",
    //     });

    //     await s3Client.send(command);

    //     responseData.push({
    //       url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
    //         process.env.AWS_REGION
    //       }.amazonaws.com/${filename + i + ".png"}`,
    //       name: filename + "_" + i + ".png",
    //       contentType: "image/png",
    //     });
    //   }

    //   return NextResponse.json(responseData);
    // }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: filename,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    return NextResponse.json([
      {
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
        name: filename,
        contentType: file.type,
      },
    ]);
  } catch (error) {
    console.error("AWS Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
