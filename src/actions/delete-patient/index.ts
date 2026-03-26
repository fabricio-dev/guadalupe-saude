"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { deletePatientSchema } from "./schema";

export const deletePatient = actionClient
  .schema(deletePatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (session.user.role !== "admin") {
      throw new Error("Contate o administrador para deletar este paciente");
    }

    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient) {
      throw new Error("Paciente não encontrado");
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));
    revalidatePath("/patients");
  });
