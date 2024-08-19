import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsFillReplyFill } from "react-icons/bs";
import { IoMdMore } from "react-icons/io";
import { useAppDispatch } from "@/app/libs/hooks";
import { setReplyMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { ConversationMessage } from "@/app/shared/types/conversation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Fragment, useState } from "react";
import { RECALL_MESSAGE_ROUTE } from "@/app/shared/constants/ApiRoute";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getSocket } from "@/socket";
import { SOCKET_EVENT } from "@/app/shared/enums";
import RenderIf from "../../ui/RenderIf";

interface Props {
  message: ConversationMessage;
  isCurrentUser: boolean;
  reverse?: boolean;
}

export default function MessageAction({
  message,
  isCurrentUser,
  reverse,
}: Props) {
  const [isOpenRecall, setIsOpenRecall] = useState<boolean>(false);
  const [isOpenPin, setIsOpenPin] = useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<boolean>(false);

  const {
    isOpen: openMore,
    onOpen: onOpenMore,
    onClose: onCloseMore,
  } = useDisclosure();

  const dispatch = useAppDispatch();

  const handleReply = () => {
    dispatch(setReplyMessage(message));
  };

  const handleRecall = async () => {
    setIsOpenRecall(false);
    const session = await getSession();
    const response = await fetch(`${RECALL_MESSAGE_ROUTE}?id=${message.id}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    });
    if (response.ok) {
      toast.success("Tin nhắn đã được thu hồi");
      onCloseMore();
    } else {
      toast.error("Thu hồi tin nhắn thất bại. Vui lòng thử lại");
      onCloseMore();
    }
  };

  const handleTranfer = () => {};

  const handlePin = async () => {
    setIsOpenPin(false);
    const socket = getSocket();
    socket.emit("pinMessage", { messageId: message.id });
    onCloseMore();
  };

  const handleUnPin = async () => {
    setIsOpenMore(false);
    const socket = getSocket();
    socket.emit(SOCKET_EVENT.UN_PIN_MESSAGE, { messageId: message.id });
    onCloseMore();
  };

  return (
    <Fragment>
      <div
        className={`invisible gap-2 flex group-hover/messageItem:visible ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        <Popover
          showArrow
          isOpen={isOpenMore}
          onOpenChange={(open) => setIsOpenMore(open)}
        >
          <Tooltip content="Xem thêm" showArrow>
            <div>
              <PopoverTrigger>
                <div className="p-1 hover:bg-gray-100 rounded-full hover:cursor-pointer">
                  <IoMdMore className="text-lg" />
                </div>
              </PopoverTrigger>
            </div>
          </Tooltip>
          <PopoverContent className="py-2">
            <RenderIf condition={isCurrentUser}>
              <div
                className="py-2 px-4 hover:bg-gray-100 hover:cursor-pointer w-full rounded-lg"
                onClick={() => {
                  setIsOpenMore(false);
                  setIsOpenRecall(true);
                  onOpenMore();
                }}
              >
                Gỡ
              </div>
            </RenderIf>

            <div
              className="py-2 px-4 hover:bg-gray-100 hover:cursor-pointer w-full rounded-lg"
              onClick={handleTranfer}
            >
              Chuyển tiếp
            </div>
            <RenderIf condition={!message.isPin}>
              <div
                className="py-2 px-4 hover:bg-gray-100 hover:cursor-pointer w-full rounded-lg"
                onClick={() => {
                  setIsOpenMore(false);
                  setIsOpenPin(true);
                  onOpenMore();
                }}
              >
                Ghim
              </div>
            </RenderIf>

            <RenderIf condition={message.isPin}>
              <div
                className="py-2 px-4 hover:bg-gray-100 hover:cursor-pointer w-full rounded-lg"
                onClick={handleUnPin}
              >
                Bỏ ghim
              </div>
            </RenderIf>
          </PopoverContent>
        </Popover>
        <Tooltip content="Trả lời" showArrow>
          <div
            className="p-1 hover:bg-gray-100 rounded-full hover:cursor-pointer"
            onClick={handleReply}
          >
            <BsFillReplyFill className="text-lg" />
          </div>
        </Tooltip>

        <Tooltip content="Bày tỏ cảm xúc" showArrow>
          <div className="p-1 hover:bg-gray-100 rounded-full hover:cursor-pointer">
            <MdOutlineEmojiEmotions className="text-lg" />
          </div>
        </Tooltip>
      </div>

      <Modal isOpen={isOpenRecall} hideCloseButton>
        <ModalContent>
          <ModalHeader className="flex justify-center">
            Bạn muốn thu hồi tin nhắn này ?
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-500">
              Tin nhắn này sẽ bị thu hồi với mọi người trong đoạn chat. Những
              người khác có thể đã xem hoặc chuyển tiếp tin nhắn đó
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpenRecall(false)}
            >
              Hủy
            </Button>
            <Button color="primary" onClick={handleRecall}>
              Thu hồi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenPin} hideCloseButton>
        <ModalContent>
          <ModalHeader className="flex justify-center">
            Bạn muốn ghim tin nhắn này ?
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-500">
              Tin nhắn này sẽ được ghim trong đoạn chat. Những người khác xem
              tin nhắn này trong phần ghim
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpenPin(false)}
            >
              Hủy
            </Button>
            <Button color="primary" onClick={handlePin}>
              Ghim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
