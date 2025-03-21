import NextAuth, { type User, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Github from "next-auth/providers/github";
import { createUser, getUser } from "@/lib/db/queries";

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({}),
    Github({}),
    Apple({}),
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);
        if (users.length === 0) return null;
        return users[0];
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (
        user?.email &&
        user?.name &&
        (account?.provider === "google" || account?.provider === "github" || account?.provider === "apple")
      ) {
        const users = await getUser(user.email);
        if (users.length === 0) {
          await createUser(
            user.email,
            "",
            user.name,
            profile?.birthdate || "",
            profile?.gender === "male" ||
              profile?.gender === "female" ||
              profile?.gender === "other"
              ? profile.gender
              : "other",
            user.image || ""
          );
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user.email) {
        const users = await getUser(session.user.email);
        session.user = users[0];
      }
      return session;
    },
  },
});
