import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let studentId: string | undefined;

    // Determine context: Direct Student Login vs Parent Switch
    if (session.user.role === "STUDENT") {
      studentId = session.user.id;
    } else if (session.user.role === "PARENT" && session.user.activeStudentId) {
      studentId = session.user.activeStudentId;
    } else {
      return NextResponse.json({ error: "Unauthorized Context" }, { status: 403 });
    }

    if (!studentId) {
       return NextResponse.json({ error: "Student ID not found" }, { status: 404 });
    }

    // Fetch Student Data (Homework, Classes)
    const studentData = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        name: true,
        studentId: true,
        homeworks: {
          where: { isCompleted: false },
          orderBy: { dueDate: 'asc' },
          take: 5,
          include: {
            class: {
              include: {
                tutor: {
                  include: { user: { select: { fullname: true } } }
                }
              }
            }
          }
        },
        classes: {
          where: { 
            status: 'SCHEDULED',
            scheduledAt: { gte: new Date() }
          },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
          include: {
            tutor: {
              include: { user: { select: { fullname: true } } }
            }
          }
        }
      }
    });

    return NextResponse.json(studentData);
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
