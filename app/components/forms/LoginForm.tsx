"use client";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Chưa nhập email" })
    .email({ message: "Email không đúng định dạng" }),
  password: z.string().min(8, { message: "Mạt khẩu có ít nhất 8 kí tự" }),
});

type LoginField = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isPasswordVisiable, setIsPasswordVisiable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginField>();

  const onSubmit: SubmitHandler<LoginField> = async (data) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      router.push("/");
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mt-4">
          <Input
            isClearable
            type="text"
            label="Email"
            placeholder="Nhập email của bạn"
            variant="bordered"
            labelPlacement="outside"
            {...register("email")}
          />
          <Input
            type={isPasswordVisiable ? "text" : "password"}
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            variant="bordered"
            labelPlacement="outside"
            description="Bạn không nên chia sẻ mật khẩu với người lạ"
            endContent={
              <button
                type="button"
                onClick={() => setIsPasswordVisiable(!isPasswordVisiable)}
              >
                {isPasswordVisiable ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            {...register("password")}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          className="w-full mt-8"
          isLoading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>
    </Fragment>
  );
};

export default LoginForm;
