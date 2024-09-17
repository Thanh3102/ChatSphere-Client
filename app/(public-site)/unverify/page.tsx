import ResendVerifyButton from "@/app/components/pages/unverify/ResendVerifyButton";
import { authOption } from "@/app/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuMailWarning } from "react-icons/lu";

export default async function Page() {
  const session = await getServerSession(authOption);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col w-[500px] mx-auto">
      <div className="justify-center items-center flex p-5 bg-red-500 rounded-full">
        <LuMailWarning className="text-8xl text-white" />
      </div>
      <h1 className="text-3xl font-semibold my-4">
        Xác thực tài khoản của bạn
      </h1>
      <span className="text-center">
        Xin chào <span className="font-semibold">{session?.user.name}</span>,
        vui lòng xác thực email{" "}
        <span className="font-semibold">{session?.user.email}</span> của bạn để
        có thể sử dụng ứng dụng
      </span>
      <ResendVerifyButton id={session.user.id} />
      <span className="text-center text-gray-500 mt-5">
        Gặp vấn đề ? Liên hệ chúng tôi tại{" "}
        <span className="font-semibold">chatsphere565@gmail.com</span>
      </span>
    </div>
  );
}
