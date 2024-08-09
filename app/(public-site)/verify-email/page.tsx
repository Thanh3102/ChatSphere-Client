"use client";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiMailSend } from "react-icons/bi";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbReload } from "react-icons/tb";

const Page = () => {
  const [status, setStatus] = useState<"PENDING" | "REJECT" | "FULLFILL">(
    "PENDING"
  );
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const otp = searchParams.get("otp");

  const sendVerifyOTP = async (userId: string, otp: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/verify-email?id=${id}&otp=${otp}`,
      {
        method: "POST",
      }
    ).then(
      (res) => res.json() as Promise<{ statusCode: number; message: string }>
    );
    if (response.statusCode === 200) {
      setStatus("FULLFILL");
      setMessage(response.message);
    } else {
      setStatus("REJECT");
      setMessage(response.message);
    }
  };

  const handleRetry = () => {
    setStatus("PENDING");
    if (id && otp) {
      sendVerifyOTP(id, otp);
    } else {
      setStatus("REJECT");
    }
  };

  const handleNewVerify = () => {
    const createNewOTP = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/resend-verify-email?id=${id}`,
          {
            method: "POST",
          }
        ).then(
          (res) =>
            res.json() as Promise<{ statusCode: number; message: string }>
        );
        if (response.statusCode == 200) {
          resolve(response.message);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        reject(error);
      }
    });
    toast.promise(
      createNewOTP,
      {
        loading: "Đang tạo mã OTP mới",
        success: (message) => `${message}`,
        error: (error) => `${error}`,
      },
      {
        position: "top-center",
      }
    );
  };


  useEffect(() => {
    if (id && otp) {
      sendVerifyOTP(id, otp);
    }
  }, []);

  if (status === "PENDING") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Đang xác thực, vui lòng đợi..." />
      </div>
    );
  } else {
    if (status === "FULLFILL")
      return (
        <div className="flex justify-center items-center h-screen flex-col">
          <div className="justify-center items-center flex">
            <FaRegCircleCheck className="text-8xl text-green-400" />
          </div>
          <h1 className="text-3xl font-bold my-5">"Xác thực thành công"</h1>
          <span>{message}</span>
          <div className="flex gap-4 mt-4">
            <Link href={"/"}>
              <Button
                color="primary"
                endContent={<IoIosArrowRoundForward className="text-4xl" />}
              >
                Tới trang chủ
              </Button>
            </Link>
          </div>
        </div>
      );
    else if (status === "REJECT") {
      return (
        <div className="flex justify-center items-center h-screen flex-col">
          <div className="justify-center items-center flex">
            <FaRegCircleXmark className="text-8xl text-red-400" />
          </div>
          <h1 className="text-3xl font-bold my-5">"Xác thực thất bại"</h1>
          <span>{message}</span>
          <div className="flex gap-4 mt-4">
            <Button
              color="secondary"
              startContent={<TbReload className="text-2xl" />}
              onClick={handleRetry}
            >
              Thử lại
            </Button>
            <Button
              color="primary"
              startContent={<BiMailSend className="text-2xl" />}
              onClick={handleNewVerify}
            >
              Nhận mã OTP mới
            </Button>
          </div>
        </div>
      );
    }
  }
};

export default Page;
