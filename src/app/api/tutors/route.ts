import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const classesTaught = searchParams.get("classesTaught");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");

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

    if (classesTaught) {
      whereClause.classesTaught = {
        contains: classesTaught,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      whereClause.hourlyRate = {};
      if (minPrice) whereClause.hourlyRate.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.hourlyRate.lte = parseFloat(maxPrice);
    }

    if (rating) {
        whereClause.rating = {
            gte: parseFloat(rating)
        };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullname: true,
            phoneNumber: true,
            profileImage: true, // Select profileImage
            image: true,
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
