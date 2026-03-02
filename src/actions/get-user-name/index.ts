"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { getUserNameSchema } from "./schema";

export const getUserName = actionClient
  .schema(getUserNameSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, parsedInput.userId),
      columns: { name: true },
    });
    return user?.name ?? null;
  });
