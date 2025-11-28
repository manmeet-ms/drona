import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { registerSchema } from "@/src/lib/validation/authSchema";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/src/lib/tokens";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parse = registerSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parse.error.flatten() },
        { status: 400 }
      );
    }

    const { fullname, email, password, role } = parse.data;

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

    // derive a username (unique) from email or fullname
    const baseUsername = (email?.split("@")[0] || fullname.replace(/\s+/g, "").toLowerCase()).slice(0, 24);
    let username = baseUsername;
    let suffix = 0;
    while (await prisma.user.findUnique({ where: { username } })) {
      suffix += 1;
      username = `${baseUsername}${suffix}`.slice(0, 30);
      if (suffix > 50) break;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateOTP();
    const verificationTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        fullname,
        role,
        verficationToken: verificationToken,
        verficationTokenExpiry: verificationTokenExpiry,
        isVerified: false,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, username, verificationToken);

    return NextResponse.json({ message: "User created. Please verify your email.", userId: user.id }, { status: 201 });
  } catch (err: any) {
    console.error("Registration error:", err);
    const message = err?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
