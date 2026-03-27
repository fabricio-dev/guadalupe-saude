import { adminClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

const clientBaseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL || undefined);

export const authClient = createAuthClient({
  ...(clientBaseURL ? { baseURL: clientBaseURL } : {}),
  fetchOptions: {
    credentials: "include",
  },
  plugins: [customSessionClient<typeof auth>(), adminClient()],
});
