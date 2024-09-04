"use client";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { BiMailSend } from "react-icons/bi";

interface Props {
  id: string;
}

export default function ResendVerifyButton({ id }: Props) {
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
  return (
    <Button
      color="primary"
      startContent={<BiMailSend className="text-2xl" />}
      onClick={handleNewVerify}
      className="mt-4"
    >
      Nhận mã OTP mới
    </Button>
  );
}
