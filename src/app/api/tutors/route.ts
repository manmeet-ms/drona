import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");

    const whereClause: any = {};

    if (subject) {
      whereClause.subjects = {
        has: subject,
      };
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return NextResponse.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
