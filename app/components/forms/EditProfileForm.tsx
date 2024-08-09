import { Button, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  user: any;
  readonly: boolean;
  onClose: () => void;
}

const editFormSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type UserEditField = z.infer<typeof editFormSchema>;

const EditProfileForm = ({ user, readonly, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserEditField>({
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit: SubmitHandler<UserEditField> = (data) => {
    console.log(data);
    onClose();
  };
  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap -mx-4">
        <div className="w-1/2 px-4">
          <Input
            label="Họ tên"
            variant="faded"
            readOnly={readonly}
            {...register("name")}
          />
        </div>
      </div>
      {readonly ? null : (
        <div className="mt-2">
          <Button type="submit">Lưu</Button>
        </div>
      )}
    </form>
  );
};

export default EditProfileForm;
