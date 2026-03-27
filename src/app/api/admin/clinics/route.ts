import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { clinicsTable } from "@/db/schema";

export async function GET() {
  try {
    const clinics = await db
      .select({
        id: clinicsTable.id,
        name: clinicsTable.name,
      })
      .from(clinicsTable)
      .orderBy(asc(clinicsTable.name));

    return NextResponse.json(clinics);
  } catch (error) {
    console.error("Erro ao buscar clínicas do admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
