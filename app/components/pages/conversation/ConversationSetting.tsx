import { useAppSelector } from "@/app/libs/hooks";
import { Emoji } from "emoji-picker-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import RenderIf from "../../ui/RenderIf";
import { FaPen, FaRegImage } from "react-icons/fa6";
import ChangeEmojiModal from "./ChangeEmojiModal";
import ChangeGroupNameModal from "./ChangeGroupNameModal";
import { UPDATE_CONVERSATION_SETTING_ROUTE } from "@/app/shared/constants/ApiRoute";
import { getSession } from "next-auth/react";

export default function ConversationSetting() {
  const { conversation } = useAppSelector((state) => state.conversation);
  const [openEmojiModal, setOpenEmojiModal] = useState<boolean>(false);
  const [openChangeGroupNameModal, setOpenChangeGroupNameModal] =
    useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      if (conversation) {
        formData.append("id", conversation.id);
      }
      const session = await getSession();
      await fetch(`${UPDATE_CONVERSATION_SETTING_ROUTE}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });
    }
  };

  return (
    <>
      <div
        className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
        onClick={() => setOpenEmojiModal(true)}
      >
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-gray-300 rounded-full">
            <Emoji unified={conversation ? conversation.emoji : ""} size={14} />
          </div>
          <span>Thay đổi biểu tượng cảm xúc</span>
        </div>
      </div>
      <RenderIf condition={conversation?.isGroup}>
        <div
          className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
          onClick={() => setOpenChangeGroupNameModal(true)}
        >
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-gray-300 rounded-full">
              <FaPen />
            </div>
            <span>Đổi tên đoạn chat</span>
          </div>
        </div>
      </RenderIf>
      <RenderIf condition={conversation?.isGroup}>
        <div
          className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
          onClick={handleImageClick}
        >
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-gray-300 rounded-full">
              <FaRegImage />
            </div>
            <span>Thay đổi hình ảnh</span>
            <input
              type="file"
              className="hidden"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </RenderIf>
      <ChangeEmojiModal isOpen={openEmojiModal} setOpen={setOpenEmojiModal} />
      <ChangeGroupNameModal
        isOpen={openChangeGroupNameModal}
        setIsOpen={setOpenChangeGroupNameModal}
      />
    </>
  );
}
