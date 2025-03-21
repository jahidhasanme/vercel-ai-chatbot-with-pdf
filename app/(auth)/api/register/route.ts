import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcrypt-ts";
import { createUser, getUser } from "@/lib/db/queries";
import { signIn } from "../../auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  dob: z.string(),
  gender: z.enum(["male", "female", "other"]),
  profileImage: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("full_name"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      profileImage: formData.get("profileImage") as string | undefined,
    });

    const users = await getUser(validatedData.email);

    if (users.length > 0) {
      return NextResponse.json({ status: "user_exists" }, { status: 409 });
    }

    const hashedPassword = await hash(validatedData.password, 10);

    await createUser(
      validatedData.email,
      hashedPassword,
      validatedData.full_name,
      validatedData.dob,
      validatedData.gender,
      validatedData.profileImage || ""
    );

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
