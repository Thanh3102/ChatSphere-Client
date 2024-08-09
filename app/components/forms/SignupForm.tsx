"use client";

import { SIGNUP_ROUTE } from "@/app/shared/constants/ApiRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const SignupSchema = z
  .object({
    name: z.string().min(1, { message: "Tên không thể là giá trị trống" }),
    email: z.string().email({ message: "Email không đúng định dạng" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không chính xác",
    path: ["confirmPassword"],
  });

type SignupField = z.infer<typeof SignupSchema>;

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupField>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit: SubmitHandler<SignupField> = async (data) => {
    setIsLoading(true);

    const createUser = new Promise(async (resolve, reject) => {
      const response = await fetch(
        SIGNUP_ROUTE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json());
      if (response.statusCode === 200) {
        setIsLoading(false);
        resolve(response.message);
      } else {
        setIsLoading(false);
        reject(response.message);
      }
    });

    toast.promise(
      createUser,
      {
        loading: "Đang tạo tài khoản",
        success: (message) => `${message}`,
        error: (error) => `${error}`,
      },
      {
        position: "top-center",
        duration: 3000,
      }
    );

    setIsLoading(false);
  };

  return (
    <Fragment>
      <form
        className="mt-10 gap-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Chúng tôi nên gọi bạn là ?"
          type="text"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập tên của bạn"
          isInvalid={errors.name ? true : false}
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email của bạn"
          type="text"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập email của bạn"
          isInvalid={errors.email ? true : false}
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Mật khẩu"
          type="password"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập mật khẩu của bạn"
          description="Mật khẩu có ít nhất 8 kí tự và nên chứa cả số, chữ và kí tự"
          isInvalid={errors.password ? true : false}
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập lại mật khẩu của bạn"
          isInvalid={errors.confirmPassword ? true : false}
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          className="mt-5 text-base font-medium hover:text-white hover:bg-green-400"
          type="submit"
          radius="full"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Tạo tài khoản
        </Button>
      </form>
    </Fragment>
  );
};

export default SignupForm;
