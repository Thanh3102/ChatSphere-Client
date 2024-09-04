"use client";
import { CHANGE_PASSWORD_ROUTE } from "@/app/shared/constants/ApiRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Không thể để trống" }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu có ít nhất 8 kí tự" })
      .max(30, { message: "Mật khẩu chứa tối đa 30 kí tự" }),
    confirmPassword: z.string().min(1, { message: "Không thể để trống" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu nhập lại không chính xác",
    path: ["confirmPassword"],
  });

type ChangePasswordField = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordField>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordField> = async (data) => {
    reset();
    setIsLoading(true);
    const session = await getSession();
    const response = await fetch(CHANGE_PASSWORD_ROUTE, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user.id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    });
    const res = await response.json();
    setIsLoading(false);

    if (response.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="pt-4 px-20">
      <h1 className="text-gray-700 font-bold text-2xl">Thay đổi mật khẩu</h1>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="password"
          label="Mật khẩu hiện tại"
          variant="bordered"
          labelPlacement="outside-left"
          classNames={{
            base: "mt-4",
            label: "min-w-[150px]",
          }}
          isInvalid={errors.oldPassword ? true : false}
          errorMessage={errors.oldPassword?.message}
          {...register("oldPassword")}
        />
        <Input
          type="password"
          label="Mật khẩu mới"
          variant="bordered"
          labelPlacement="outside-left"
          classNames={{
            base: "mt-4",
            label: "min-w-[150px]",
          }}
          isInvalid={errors.newPassword ? true : false}
          errorMessage={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          type="password"
          label="Nhập lại mật khẩu"
          variant="bordered"
          labelPlacement="outside-left"
          classNames={{
            base: "mt-4",
            label: "min-w-[150px]",
          }}
          isInvalid={errors.confirmPassword ? true : false}
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          color="primary"
          type="submit"
          className="mt-4"
          isLoading={isLoading}
        >
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
}
