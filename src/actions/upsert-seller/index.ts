"use server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { sellersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertSellerSchema } from "./schema";

dayjs.extend(utc);

export const upsertSeller = actionClient
  .schema(upsertSellerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    const nowUtc = dayjs.utc().toDate();

    if (session?.user.role === "admin" || session?.user.role === "gestor") {
      if (!parsedInput.clinicId) {
        throw new Error("Clínica não encontrada");
      }

      if (session.user.role === "gestor") {
        const [gestor] = await db
          .select({ clinicId: sellersTable.clinicId })
          .from(sellersTable)
          .where(eq(sellersTable.email, session.user.email))
          .limit(1);

        if (!gestor?.clinicId) {
          throw new Error("Gestor sem clínica vinculada");
        }

        if (parsedInput.clinicId !== gestor.clinicId) {
          throw new Error(
            "Você não tem permissão para cadastrar vendedor em outra clínica",
          );
        }
      }

      await db
        .insert(sellersTable)
        .values({
          ...parsedInput,
          id: parsedInput.id,
          createdAt: nowUtc,
          editedBy: session.user.id,
          editedAt: nowUtc,
        })
        .onConflictDoUpdate({
          target: [sellersTable.id],
          set: {
            ...parsedInput,
            editedBy: session.user.id,
            editedAt: nowUtc,
          },
        });
      revalidatePath("/sellers");
      revalidatePath("/gerente/sellers-gestor");
    } else {
      throw new Error("Unauthorized");
    }
  });
