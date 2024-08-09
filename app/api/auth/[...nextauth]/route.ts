import { REFRESH_TOKEN_ROUTE, SIGNIN_ROUTE } from "@/app/shared/constants/ApiRoute";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT) {
  console.log("[NextAuth] Refresh new access token");
  const response = await fetch(
    REFRESH_TOKEN_ROUTE,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Refresh ${token.refreshToken}`,
      },
    }
  ).then((res) => res.json());
  console.log("[NextAuth] New token response :", response);

  if (response.accessToken) {
    return {
      ...token,
      accessToken: response.accessToken,
      expiresIn: response.expiresIn,
    };
  } else {
    return {
      ...token,
      accessToken: null,
      refreshToken: null,
      user: null,
      error: "[NextAuth] Invalid Refresh Token",
    };
  }
}

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "password",
          type: "password",
        },
      },

      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;
        const response = await fetch(SIGNIN_ROUTE, {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        if (response.statusCode === 200) {
          const user = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: { ...response.user },
            expiresIn: response.expiresIn,
          };
          return user;
        }

        throw new Error(response.message);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    //@ts-ignore
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.expiresIn) {
        return token;
      }

      // If accessToken expire
      console.log("Token is expire");
      return await refreshToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handle = NextAuth(authOption);

export { handle as GET, handle as POST };
