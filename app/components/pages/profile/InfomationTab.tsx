import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import EditProfileForm from "../../forms/EditProfileForm";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import Image from "next/image";
import { EMPTY_IMAGE } from "@/app/shared/constants/ImageSource";
import { UserBasicInfo } from "@/app/shared/types/user";
import { getSession } from "next-auth/react";
import { UPDATE_AVATAR_ROUTE } from "@/app/shared/constants/ApiRoute";
import toast from "react-hot-toast";

interface Props {
  user: UserBasicInfo;
}

const InfomationTab = ({ user }: Props) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isOpenAvatarSelect, setIsOpenAvatarSelect] = useState<boolean>(false);
  const [avatarSource, setAvatarSource] = useState<string>(EMPTY_IMAGE);
  const [avatarFile, setAvatarFile] = useState<File>();

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      const src = URL.createObjectURL(e.target.files[0]);
      setAvatarSource(src);
    }
  };

  const handleChangeAvatar = async () => {
    const session = await getSession();
    const avatarUploadPromise = new Promise(async (resolve, reject) => {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const response = await fetch(UPDATE_AVATAR_ROUTE, {
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setIsOpenAvatarSelect(false);
          setAvatarSource(EMPTY_IMAGE);
          setAvatarFile(undefined);
          resolve({ message: data.message });
        } else {
          reject({ message: data.message });
        }
      } else {
        reject({ message: "Chưa chọn hình ảnh. Vui lòng thử lại" });
      }
    });
    toast.promise(avatarUploadPromise, {
      loading: "Đang tải lên ảnh đại diện ...",
      error: (error: any) => `${error.message}`,
      success: (data: any) => `${data.message}`,
    });
  };

  return (
    <Fragment>
      <div className="py-5">
        <div className="flex items-center">
          <div className="flex-1 flex gap-4 items-center">
            <Avatar showFallback src={user.image ?? ""} />
            <div className="">
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm">{user.email}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              color="secondary"
              onClick={() => {
                setIsOpenAvatarSelect(true);
              }}
            >
              Thay đổi ảnh đại diện
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setIsReadOnly(false);
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
        <EditProfileForm
          user={user}
          readonly={isReadOnly}
          onClose={() => setIsReadOnly(true)}
        />
      </div>
      <Modal
        isOpen={isOpenAvatarSelect}
        onOpenChange={(open) => {
          setIsOpenAvatarSelect(open);
        }}
        classNames={{ closeButton: "top-[0.75rem]" }}
      >
        <ModalContent>
          <ModalHeader>Thay đổi ảnh đại diện</ModalHeader>
          <ModalBody>
            <div className="h-[400px] flex flex-col items-center justify-center">
              <div className="w-full h-[350px] relative">
                <Image
                  src={avatarSource}
                  alt=""
                  className="rounded-lg"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => avatarInputRef.current?.click()}
                  color="secondary"
                >
                  Chọn hình ảnh
                </Button>
                {avatarFile && (
                  <Button onClick={handleChangeAvatar} color="primary">
                    Lưu
                  </Button>
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default InfomationTab;
