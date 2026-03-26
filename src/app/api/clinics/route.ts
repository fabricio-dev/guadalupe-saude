import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { clinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Listar todas as clínicas
    const clinics = await db
      .select({
        id: clinicsTable.id,
        name: clinicsTable.name,
      })
      .from(clinicsTable);

    return NextResponse.json(clinics);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
