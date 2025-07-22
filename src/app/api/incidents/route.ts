import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resolvedParam = url.searchParams.get("resolved") ?? "false";
  const resolved = resolvedParam === "true";

  const incidents = await prisma.incident.findMany({
    where: { resolved },
    include: { camera: true },
    orderBy: { tsStart: "desc" },
  });

  return NextResponse.json(incidents);
}
