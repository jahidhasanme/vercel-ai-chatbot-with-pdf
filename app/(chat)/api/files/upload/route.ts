// import { put } from '@vercel/blob';
// import { NextResponse } from 'next/server';
// import { z } from 'zod';

// import { auth } from '@/app/(auth)/auth';

// // Use Blob instead of File since File is not available in Node.js environment
// const FileSchema = z.object({
//   file: z
//     .instanceof(Blob)
//     .refine((file) => file.size <= 5 * 1024 * 1024, {
//       message: 'File size should be less than 5MB',
//     })
//     // Update the file type based on the kind of files you want to accept
//     .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
//       message: 'File type should be JPEG or PNG',
//     }),
// });

// export async function POST(request: Request) {
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (request.body === null) {
//     return new Response('Request body is empty', { status: 400 });
//   }

//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as Blob;

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     const validatedFile = FileSchema.safeParse({ file });

//     if (!validatedFile.success) {
//       const errorMessage = validatedFile.error.errors
//         .map((error) => error.message)
//         .join(', ');

//       return NextResponse.json({ error: errorMessage }, { status: 400 });
//     }

//     // Get filename from formData since Blob doesn't have name property
//     const filename = (formData.get('file') as File).name;
//     const fileBuffer = await file.arrayBuffer();

//     try {
//       const data = await put(`${filename}`, fileBuffer, {
//         access: 'public',
//       });

//       return NextResponse.json(data);
//     } catch (error) {
//       return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to process request' },
//       { status: 500 },
//     );
//   }
// }


import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';
import { v4 as uuidv4 } from 'uuid';

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
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
      message: 'File type should be PDF, JPEG, or PNG',
    }),    
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const filename = `${uuidv4()}-${(file as File).name}`;
    const fileBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: filename,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    return NextResponse.json({
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
      downloadUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}?download=1`,
      pathname: filename,
      contentType: file.type,
      contentDisposition: `inline; filename="${(file as File).name}"`,
    });
    
  } catch (error) {
    console.error('AWS Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
