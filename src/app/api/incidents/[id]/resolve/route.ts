// src/app/api/incidents/[id]/resolve/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: any
) {
  // 👇 params is async now, so await it
  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);

  const current = await prisma.incident.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json(
      { error: "Incident not found" },
      { status: 404 }
    );
  }

  const incident = await prisma.incident.update({
    where: { id },
    data: { resolved: !current.resolved },
  });

  return NextResponse.json(incident);
}
