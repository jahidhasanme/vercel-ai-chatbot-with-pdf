import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcrypt-ts";
import { getUser } from "@/lib/db/queries";
import { signIn } from "../../auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const users = await getUser(validatedData.email);

    if (users.length === 0) {
      return NextResponse.json({ status: "failed" }, { status: 401 });
    }

    const passwordsMatch = await compare(
      validatedData.password,
      users[0].password!
    );

    if (!passwordsMatch) {
      return NextResponse.json({ status: "failed abja" }, { status: 401 });
    }

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: "invalid_data" }, { status: 400 });
    }

    return NextResponse.json({ status: "failed" }, { status: 500 });
  }
}
