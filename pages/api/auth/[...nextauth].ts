import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (email !== "admin@gmail.com" || password !== "1234") {
          throw new Error("Invalid Credentials");
        }
        return { id: "1234", name: "Admin", email: "admin@gmail.com" };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "91e44ea9a6cc9bf480a4",
      clientSecret:
        process.env.GITHUB_SECRET || "6384ed73cbb9fe704bf348a50987611e028a7019",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
