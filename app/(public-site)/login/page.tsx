import LoginForm from "@/app/components/forms/LoginForm";
import { authOption } from "@/app/libs/authOptions";
import { Divider } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMail } from "react-icons/io5";

const Page = async () => {
  const session = await getServerSession(authOption);
  if (session?.user) {
    redirect("/conversations");
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-full">
      <div className="rounded-lg p-8 bg-white">
        <h1 className="text-center my-3 font-bold text-2xl text-blue-600">
          Chat Sphere
        </h1>
        <div className="flex h-[400px] w-[800px]">
          <div className="flex-1">
            <p className="font-medium text-xl text-center">Tạo tài khoản</p>
            <div className="flex mt-6 gap-8 flex-col justify-center">
              <div className="flex items-center pl-20 border-1 border-gray-500 py-3 rounded-full bg-stone-200 hover:cursor-not-allowed">
                <FaFacebook className="text-blue-500 text-3xl" />
                <span className="font-medium text-base ml-5">
                  Đăng ký với Facebook
                </span>
              </div>
              <div className="flex items-center pl-20 border-1 border-gray-500 py-3 rounded-full bg-stone-200 hover:cursor-not-allowed">
                <FcGoogle className="text-3xl" />
                <span className="font-medium text-base ml-5">
                  Đăng ký với Google
                </span>
              </div>
              <div className="flex items-center pl-20 border-1 border-gray-500 py-3 rounded-full bg-stone-200 hover:cursor-not-allowed">
                <FaGithub className="text-3xl" />
                <span className="font-medium text-base ml-5">
                  Đăng ký với Github
                </span>
              </div>
              <Link href={"/signup"}>
                <div className="flex items-center pl-20 border-1 border-gray-500 py-3 rounded-full hover:cursor-pointer hover:bg-slate-200">
                  <IoMail className="text-3xl" />
                  <span className="font-medium text-base ml-5">
                    Đăng ký với Email
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <Divider orientation="vertical" className="mx-8" />
          <div className="flex-1">
            <p className="font-medium text-xl text-center">Đăng nhập</p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
