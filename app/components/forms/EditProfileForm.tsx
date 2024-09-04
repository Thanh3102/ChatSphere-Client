"use client";
import { UserDetailInfo } from "@/app/shared/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import RenderIf from "../ui/RenderIf";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { UPDATE_USER_PROFILE } from "@/app/shared/constants/ApiRoute";
import toast from "react-hot-toast";

interface Props {
  user: UserDetailInfo;
  readonly: boolean;
  onClose: () => void;
}

const editFormSchema = z.object({
  name: z.string().min(1, { message: "Tên không thể là giá trị trống" }),
  dateOfBirth: z
    .date({
      required_error: "Chưa nhập giá trị",
      invalid_type_error: "Không đúng định dạng",
    })
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
});

type UserEditField = z.infer<typeof editFormSchema>;

const EditProfileForm = ({ user, readonly, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<UserEditField>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      dateOfBirth: new Date(user.dateOfBirth),
      gender: user.gender,
    },
  });

  const onSubmit: SubmitHandler<UserEditField> = async (data) => {
    const session = await getSession();
    setIsLoading(true);
    const response = await fetch(UPDATE_USER_PROFILE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ id: session?.user.id, ...data }),
    });

    const res = await response.json();
    if (response.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form
      className="mt-2 min-w-24"
      onSubmit={handleSubmit(onSubmit)}
      id="profileEditForm"
    >
      <div className="flex flex-wrap -mx-4">
        <div className="w-1/2 px-4 mt-4">
          <Input
            label="Họ tên"
            defaultValue={user.name}
            variant="faded"
            readOnly={readonly}
            isInvalid={errors.name ? true : false}
            errorMessage={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div className="w-1/2 px-4 mt-4">
          <Input
            label="Số điện thoại"
            defaultValue={user.phoneNumber}
            variant="faded"
            readOnly={readonly}
            isInvalid={errors.phoneNumber ? true : false}
            errorMessage={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>
        <div className="w-1/2 px-4 mt-4">
          <DatePicker
            label="Ngày sinh"
            variant="faded"
            isReadOnly={readonly}
            isInvalid={errors.dateOfBirth ? true : false}
            errorMessage={errors.dateOfBirth?.message}
            defaultValue={parseDate(user.dateOfBirth.toString().split("T")[0])}
            onChange={(dateValue: DateValue) => {
              setValue("dateOfBirth", dateValue.toDate(getLocalTimeZone()));
            }}
            showMonthAndYearPickers
          />
        </div>
        <div className="w-1/2 px-4 mt-4">
          <Select
            label="Giới tính"
            variant="faded"
            selectionMode="single"
            isDisabled={readonly}
            isInvalid={errors.gender ? true : false}
            errorMessage={errors.gender?.message}
            defaultSelectedKeys={[getValues("gender")]}
            onSelectionChange={(key: Selection) => {
              const value = Array.from(key);
              setValue("gender", value[0] as string);
            }}
          >
            <SelectItem textValue={"Nam"} key={"Nam"}>
              Nam
            </SelectItem>
            <SelectItem textValue={"Nữ"} key={"Nữ"}>
              Nữ
            </SelectItem>
          </Select>
        </div>
      </div>
      <RenderIf condition={!readonly}>
        <div className="mt-2 flex gap-2 justify-end">
          <Button
            form="profileEditForm"
            color="danger"
            className="text-white"
            onClick={handleCancel}
            isDisabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="profileEditForm"
            color="primary"
            className="text-white"
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Lưu
          </Button>
        </div>
      </RenderIf>
    </form>
  );
};

export default EditProfileForm;
