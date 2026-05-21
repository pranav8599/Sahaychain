import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const prismaAdapter = PrismaAdapter(prisma);

const customAdapter: any = {
  ...prismaAdapter,
  createUser: async (data: any) => {
    const { name, fullName, ...rest } = data;
    const created = await prisma.user.create({
      data: {
        ...rest,
        fullName: name || fullName || "",
      },
    });
    return {
      ...created,
      name: created.fullName,
    };
  },
  getUser: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      ...user,
      name: user.fullName,
    };
  },
  getUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      ...user,
      name: user.fullName,
    };
  },
  getUserByAccount: async (provider_providerAccountId: { provider: string; providerAccountId: string }) => {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId },
      select: { user: true },
    });
    const user = account?.user ?? null;
    if (!user) return null;
    return {
      ...user,
      name: user.fullName,
    };
  },
  updateUser: async ({ id, name, fullName, ...data }: any) => {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(name !== undefined ? { fullName: name } : fullName !== undefined ? { fullName } : {}),
      },
    });
    return {
      ...updated,
      name: updated.fullName,
    };
  },
  getSessionAndUser: async (sessionToken: string) => {
    const userAndSession = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!userAndSession) return null;
    const { user, ...session } = userAndSession;
    return {
      session,
      user: {
        ...user,
        name: user.fullName,
      },
    };
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
  // We use session strategy "jwt" because we are using a Credentials provider,
  // which requires JWT strategy in NextAuth.
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Google provider handles email verification automatically (trusts Google)
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
          role: "USER",
          trustScore: 100,
          impactScore: 0,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Verify if email is verified
        if (!user.emailVerified) {
          throw new Error("Email not verified. Please verify your email first.");
        }

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          image: user.image,
          role: user.role,
          trustScore: user.trustScore,
          impactScore: user.impactScore,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.trustScore = (user as any).trustScore || 100;
        token.impactScore = (user as any).impactScore || 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).trustScore = token.trustScore;
        (session.user as any).impactScore = token.impactScore;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "sahaychain-secret-dev",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
