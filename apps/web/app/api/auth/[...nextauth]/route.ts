import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { AuthConfig } from "next-auth";

export const runtime = "edge";

const config: AuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    // Fill client IDs/secrets via Cloudflare environment variables mapped to pages project env
    GitHub,
    Google,
    Credentials({
      name: "Passcode",
      credentials: { passcode: { label: "Passcode", type: "password" } },
      authorize: async (creds) => {
        if (creds?.passcode === process.env.AUTH_SECRET) {
          return { id: "admin", name: "CloudCurio Admin" };
        }
        return null;
      }
    })
  ]
};

const handler = NextAuth(config);
export { handler as GET, handler as POST };
