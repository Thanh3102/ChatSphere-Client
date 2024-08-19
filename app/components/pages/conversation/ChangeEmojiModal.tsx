"use client";
import { useAppSelector } from "@/app/libs/hooks";
import { categories_VN } from "@/app/libs/ReactEmojiPicker";
import { UPDATE_CONVERSATION_SETTING_ROUTE } from "@/app/shared/constants/ApiRoute";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SuggestionMode,
} from "emoji-picker-react";
import { getSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ChangeEmojiModal({ isOpen, setOpen }: Props) {
  const { conversation } = useAppSelector((state) => state.conversation);
  const handleEmojiClick = async (emojiObj: EmojiClickData) => {
    setOpen(false);
    const session = await getSession();
    await fetch(`${UPDATE_CONVERSATION_SETTING_ROUTE}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emoji: emojiObj.unified, id: conversation?.id }),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
      }}
      classNames={{
        closeButton: "top-[0.75rem]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">
          Thay đổi biểu tượng cảm xúc
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-center">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              emojiStyle={EmojiStyle.FACEBOOK}
              width="100%"
              height={300}
              searchPlaceholder="Tìm kiếm biểu tượng cảm xúc"
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
              suggestedEmojisMode={SuggestionMode.RECENT}
              categories={categories_VN}
              style={{
                borderStyle: "none",
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
