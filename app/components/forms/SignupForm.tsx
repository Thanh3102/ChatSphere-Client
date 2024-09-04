"use client";

import { SIGNUP_ROUTE } from "@/app/shared/constants/ApiRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
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
    dateOfBirth: z
      .date({ message: "Chưa chọn giá trị" })
      .min(new Date("1900-01-01"), {
        message: "Giá trị không hợp lệ",
      })
      .max(new Date(), { message: "Giá trị không hợp lệ" }),
    phoneNumber: z
      .string({ message: "Chưa nhập giá trị" })
      .regex(RegExp(/^[0-9]{10}$/), {
        message: "Số điện thoại không đúng định dạng",
      }),
    gender: z.string().min(1, { message: "Chưa chọn giá trị" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không chính xác",
    path: ["confirmPassword"],
  });

type SignupField = z.infer<typeof SignupSchema>;

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupField>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit: SubmitHandler<SignupField> = async (data) => {
    setIsLoading(true);
    const response = await fetch(SIGNUP_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setIsLoading(false);
      toast.success(
        "Đăng ký thành công. Mã xác thực đã gửi tới email của bạn",
        { position: "top-right" }
      );
      router.push("/login");
    } else {
      setIsLoading(false);
      const data = await response.json();
      toast.error(data.message, { position: "top-right" });
    }

    setIsLoading(false);
  };

  const handleDateChange = (dateValue: DateValue) => {
    try {
      setValue("dateOfBirth", dateValue.toDate(getLocalTimeZone()));
    } catch (error) {}
  };

  return (
    <Fragment>
      <form
        className="mt-5 flex flex-wrap -mx-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Họ tên"
          type="text"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập tên của bạn"
          isInvalid={errors.name ? true : false}
          errorMessage={errors.name?.message}
          {...register("name")}
          classNames={{
            base: "px-2 w-full pt-4",
          }}
        />
        <Input
          label="Email"
          type="text"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập email của bạn"
          isInvalid={errors.email ? true : false}
          errorMessage={errors.email?.message}
          {...register("email")}
          classNames={{
            base: "px-2 w-1/2 pt-4",
          }}
        />

        <Input
          label="Số điện thoại"
          type="text"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          placeholder="Nhập số điện thoại"
          isInvalid={errors.phoneNumber ? true : false}
          errorMessage={errors.phoneNumber?.message}
          {...register("phoneNumber")}
          classNames={{
            base: "px-2 w-1/2 pt-4",
          }}
        />
        <DatePicker
          label="Ngày sinh"
          variant="bordered"
          labelPlacement="outside"
          radius="sm"
          isInvalid={errors.dateOfBirth ? true : false}
          errorMessage={errors.dateOfBirth?.message}
          showMonthAndYearPickers
          classNames={{
            base: "px-2 w-1/2 pt-4",
          }}
          onChange={handleDateChange}
        />

        <Select
          label="Giới tính"
          radius="sm"
          placeholder="Chọn giới tính"
          variant="bordered"
          labelPlacement="outside"
          isInvalid={errors.gender ? true : false}
          errorMessage={errors.gender?.message}
          classNames={{
            base: "px-2 w-1/2 pt-4",
          }}
          {...register("gender")}
        >
          <SelectItem key={"Nam"} value={"Nam"}>
            Nam
          </SelectItem>
          <SelectItem key={"Nữ"} value={"Nữ"}>
            Nữ
          </SelectItem>
        </Select>

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
          classNames={{
            base: "px-2 w-full pt-4",
          }}
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
          classNames={{
            base: "px-2 w-full pt-4",
          }}
        />

        <div className="px-2 w-full pt-4 flex justify-center items-center">
          <Button
            className="mt-5 text-base font-medium hover:text-white hover:bg-green-400"
            type="submit"
            radius="full"
            isLoading={isLoading}
            isDisabled={isLoading}
            fullWidth
          >
            Tạo tài khoản
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default SignupForm;
