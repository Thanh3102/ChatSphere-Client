import { useAppSelector } from "@/app/libs/hooks";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import ConversationPinMessageList from "./ConversationPinMessageList";
import RenderIf from "../../ui/RenderIf";

interface Props {
  isOpen: boolean;
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
}

//(open) => dispatch(setOpenPinMessage(open)

export default function PinMessageModal({ isOpen, onOpenChange }: Props) {
  const { conversation } = useAppSelector((state) => state.conversation);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        closeButton: "top-[0.75rem]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-center items-center">
          Tin nhắn đã ghim
        </ModalHeader>
        
        <RenderIf condition={conversation !== undefined}>
          {conversation && (
            <ModalBody>
              <ConversationPinMessageList
                pinMessages={conversation.pinMessages}
              />
            </ModalBody>
          )}
        </RenderIf>

        <RenderIf condition={conversation === undefined}>
          <div className="h-full flex items-center justify-center w-full">
            <Spinner />
          </div>
        </RenderIf>
      </ModalContent>
    </Modal>
  );
}
