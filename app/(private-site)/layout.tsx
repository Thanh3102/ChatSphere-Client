import { getServerSession } from "next-auth";
import { Fragment, ReactNode } from "react";
import { redirect } from "next/navigation";
import { CHECK_EMAIL_VERIFY } from "../shared/constants/ApiRoute";
import { signOut } from "next-auth/react";
import { authOption } from "../libs/authOptions";

interface Props {
  children: ReactNode;
}

const isUserVerifyEmail = async () => {
  const session = await getServerSession(authOption);
  if (!session || !session.user) return false;

  const response = await fetch(`${CHECK_EMAIL_VERIFY}?id=${session.user.id}`, {
    cache: "no-cache",
  });
  if (response.ok) {
    const isVerify = await response.json();

    return isVerify;
  } else {
    const { message } = await response.json();
    throw new Error(message);
  }
};

export default async function Layout({ children }: Props) {
  const session = await getServerSession(authOption);
  const isVerify = await isUserVerifyEmail();

  if (!session?.terminate) {
    signOut();
  }

  if (!isVerify) {
    redirect("/unverify");
  }

  return <Fragment>{children}</Fragment>;
}
