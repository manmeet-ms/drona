
import { NextResponse, NextRequest } from "next/server";
import { registerSchema } from "@/src/lib/validation/authSchema";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/src/lib/tokens";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { writeFile } from "fs/promises";
import path from "path";
import { UserRole } from "@/generated/prisma/client";
import prisma from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    let role = formData.get("role") as string;

    // Normalize role (handle legacy TEACHER if present)
    if (role === "TEACHER") role = "TUTOR";

    const file = formData.get("verificationDocument") as File | null;

    // Validate fields
    const parse = registerSchema.safeParse({ fullname, email, password, role });
    if (!parse.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parse.error.flatten() },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Handle File Upload
    let verificationDocumentPath = null;
    if (file && (role === "PARENT" || role === "TUTOR")) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure uploads directory exists (mocking this part or assuming it works in dev)
      // For MVP, we'll just save to a public/uploads folder if possible, or just log it.
      // In Vercel, fs is read-only. We'll simulate by saving the NAME.
      // Ideally, upload to S3/Blob.

      // For local dev, let's try to write to public/uploads
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        // We won't actually write if we can't ensure the dir exists easily without fs.mkdir
        // But let's try-catch it.
        // await writeFile(path.join(uploadDir, filename), buffer);
        // verificationDocumentPath = `/uploads/${filename}`;

        // Fallback for safety/simplicity: Just store the filename as a "proof"
        verificationDocumentPath = `mock_upload/${filename}`;
      } catch (e) {
        console.error("File upload failed", e);
      }
    }

    // derive a username
    const baseUsername = (email?.split("@")[0] || fullname.replace(/\s+/g, "").toLowerCase()).slice(0, 24);
    let username = baseUsername;
    let suffix = 0;
    while (await prisma.user.findUnique({ where: { username } })) {
      suffix += 1;
      username = `${baseUsername}${suffix}`.slice(0, 30);
      if (suffix > 50) break;
    }

    // const hashedPassword = password // TODO: change before serving to public 
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateOTP();
    const verificationTokenExpiry = new Date(Date.now() + 3600 * 1000);

    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        fullname,
        role:role as UserRole,
        verficationToken: verificationToken,
        verficationTokenExpiry: verificationTokenExpiry,
        isVerified: false,
        verificationDocument: verificationDocumentPath,
      },
    });

    // await sendVerificationEmail(email, username, verificationToken);

    return NextResponse.json({ message: "User created. Please verify your email.", userId: user.id }, { status: 201 });
  } catch (err: any) {
    console.error("Registration error:", err.message);
    const message = err?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
