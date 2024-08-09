import { Fragment } from "react";
import SignupForm from "../../components/forms/SignupForm";
import SocialSignup from "../../components/pages/signup/SocialSignup";
import Link from "next/link";

const Page = () => {
  return (
    <Fragment>
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <div className="bg-white p-5 rounded-lg shadow-md min-w-[500px]">
          <div className="text-center">
            <h1 className="font-bold text-2xl">Tạo tài khoản</h1>
            <p>
              Bạn đã có tài khoản ?{" "}
              <Link href={"/login"}>
                <span className="font-medium underline">Đăng nhập</span>
              </Link>
            </p>
          </div>
          <SignupForm />
          <SocialSignup />
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
