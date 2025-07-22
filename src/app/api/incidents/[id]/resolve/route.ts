import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: any
) {
  const params = await context.params;
  const id = parseInt(params.id, 10);
  const current = await prisma.incident.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const incident = await prisma.incident.update({
    where: { id },
    data: { resolved: !current.resolved },
  });

  return NextResponse.json(incident);
}
