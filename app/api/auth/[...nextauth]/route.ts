import { authOption } from "@/app/libs/authOptions";
import NextAuth from "next-auth/next";

const handle = NextAuth(authOption);

export { handle as GET, handle as POST };
