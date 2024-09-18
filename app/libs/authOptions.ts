import { JWT } from "next-auth/jwt";
import {
  REFRESH_TOKEN_ROUTE,
  SIGNIN_ROUTE,
} from "../shared/constants/ApiRoute";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT) {
  console.log("[NextAuth] Refresh new access token");
  const response = await fetch(REFRESH_TOKEN_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Refresh ${token.refreshToken}`,
    },
  }).then((res) => res.json());
  //   console.log("[NextAuth] New token response :", response);

  if (response.accessToken) {
    return {
      ...token,
      accessToken: response.accessToken,
      expiresIn: response.expiresIn,
    };
  } else {
    // return {
    //   ...token,
    //   accessToken: null,
    //   refreshToken: null,
    //   user: null,
    //   error: "[NextAuth] Invalid Refresh Token",
    // };
    return undefined;
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
        });

        const data = await response.json();
        if (response.ok) {
          const user = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: { ...data.user },
            expiresIn: data.expiresIn,
          };
          return user;
        }

        throw new Error(data.message);
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
      return await refreshToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      } else {
        session.terminate = true;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
