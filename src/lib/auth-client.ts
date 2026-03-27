import { adminClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

/**
 * No browser, sempre a origem atual — assim `/api/auth/*` é same-origin e envia cookies.
 * No servidor (import do módulo em RSC), usa NEXT_PUBLIC_* se existir.
 *
 * O `BETTER_AUTH_URL` do servidor precisa ser a **mesma** URL pública que o usuário usa
 * no navegador (mesmo host; ex.: se todos acessam com www, use www nas duas).
 */
function resolveClientBaseURL(): string | undefined {
  if (typeof window !== "undefined") {
    const fromEnv =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.replace(/\/$/, "");
    const origin = window.location.origin.replace(/\/$/, "");
    if (
      process.env.NODE_ENV === "development" &&
      fromEnv &&
      fromEnv !== origin
    ) {
      console.warn(
        "[auth] NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_BETTER_AUTH_URL não bate com esta aba. Ajuste o env ou acesse pelo mesmo host para evitar sessão/logout inconsistentes.",
        { fromEnv, origin },
      );
    }
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.replace(/\/$/, "") ||
    undefined
  );
}

const resolvedClientBaseURL = resolveClientBaseURL();

export const authClient = createAuthClient({
  ...(resolvedClientBaseURL ? { baseURL: resolvedClientBaseURL } : {}),
  fetchOptions: {
    credentials: "include",
  },
  plugins: [customSessionClient<typeof auth>(), adminClient()],
});

/** Origem usada para chamadas a `/api/auth/*` na aba atual. */
export function getResolvedAuthBaseURL(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return resolvedClientBaseURL ?? "";
}
