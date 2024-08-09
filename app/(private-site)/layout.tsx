import { getServerSession } from "next-auth";
import { Fragment, ReactNode } from "react";
import { authOption } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getServerSession(authOption);
  
  if (!session?.user) {
    redirect("/login");
  }

  return <Fragment>{children}</Fragment>;
}
