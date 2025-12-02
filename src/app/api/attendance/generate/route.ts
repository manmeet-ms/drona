import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json({ error: "Class ID required" }, { status: 400 });
    }

    // Verify ownership (Student or Parent of Student)
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: { student: true },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    let isAuthorized = false;
    if (session.user.role === "STUDENT" && session.user.id === classRecord.studentId) {
      isAuthorized = true;
    } else if (session.user.role === "PARENT" && session.user.activeStudentId === classRecord.studentId) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate Secure Token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Save token to class (validating it for this specific session)
    await prisma.class.update({
      where: { id: classId },
      data: { attendanceToken: token },
    });

    // Return token to frontend to generate QR
    return NextResponse.json({ token, classId, timestamp: Date.now() });

  } catch (error) {
    console.error("Error generating QR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
