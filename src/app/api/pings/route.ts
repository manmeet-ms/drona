import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
export async function GET() {
    const ping = await prisma.ping.findMany();
    return NextResponse.json(ping);
}