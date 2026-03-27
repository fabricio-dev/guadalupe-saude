import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { usersToClinicsTable } from "@/db/schema";

/** Inclui www e apex para CSRF/origin check quando usuários acessam um host e o env usa o outro. */
function buildTrustedOrigins(): string[] {
  const raw = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
  const out = new Set<string>();
  if (raw) {
    out.add(raw);
    try {
      const u = new URL(raw);
      const host = u.hostname;
      if (host.startsWith("www.")) {
        out.add(`${u.protocol}//${host.slice(4)}`);
      } else if (host && host !== "localhost" && !host.startsWith("127.")) {
        out.add(`${u.protocol}//www.${host}`);
      }
    } catch {
      /* ignore */
    }
  }
  if (process.env.NODE_ENV === "development") {
    out.add("http://localhost:3000");
    out.add("http://127.0.0.1:3000");
  }
  return [...out];
}

const trustedOrigins = buildTrustedOrigins();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  ...(trustedOrigins.length > 0 ? { trustedOrigins } : {}),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    customSession(async ({ user, session }) => {
      const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      });

      // TODO: ao mudar para varias clinica, alterar para retornar todas as clinicas
      const clinic = clinics?.[0];
      return {
        user: {
          ...user,
          role: (user as typeof user & { role?: string }).role || "user", // Garantir que role está disponível na sessão
          clinic: clinic?.clinicId
            ? {
                id: clinic?.clinicId,
                name: clinic?.clinic?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
