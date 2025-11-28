import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 400 });
        }

        if (user.verficationToken !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        if (user.verficationTokenExpiry && new Date() > user.verficationTokenExpiry) {
            return NextResponse.json({ message: "OTP expired" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verficationToken: null,
                verficationTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
