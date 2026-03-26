import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { sellersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const clinicIdFilter = searchParams.get("clinicId");

    // Buscar vendedores (todas as clínicas para admin, com filtro opcional por clinicId)
    const sellers = await db.query.sellersTable.findMany({
      where: clinicIdFilter
        ? eq(sellersTable.clinicId, clinicIdFilter)
        : undefined,
      columns: {
        id: true,
        name: true,
        clinicId: true,
      },
    });

    return NextResponse.json(sellers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
