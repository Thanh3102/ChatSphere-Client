import { ConversationMessage } from "@/app/shared/types/conversation";
import MessageContent from "./MessageContent";
import {
  Avatar,
  Divider,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { IoIosMore } from "react-icons/io";
import { DateToString } from "@/app/shared/helpers/DateFormat";
import { useState } from "react";
import { useAppDispatch } from "@/app/libs/hooks";
import {
  setFocusMessage,
  setOpenPinMessage,
} from "@/app/libs/redux/slices/ConversationSlice";
import { getSocket } from "@/socket";
import { UN_PIN_MESSAGE_EVENT } from "@/app/shared/constants/SocketEvent";

interface Props {
  message: ConversationMessage;
}

export default function ConversationPinMessageItem({ message }: Props) {
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleUnPin = () => {
    setIsMoreOpen(false);
    const socket = getSocket();
    socket.emit(UN_PIN_MESSAGE_EVENT, { messageId: message.id });
  };

  const handleSeeMessage = (message: ConversationMessage) => {
    setIsMoreOpen(false);
    dispatch(
      setFocusMessage({
        message: message,
        clickedAt: Date.now(),
      })
    );
    dispatch(setOpenPinMessage(false));
  };

  return (
    <div className="h-fit flex flex-col">
      <span className="text-right text-xs text-gray-500 mr-5">
        {DateToString(message.createdAt)}
      </span>
      <div className="px-2 w-full flex items-center gap-2 group/pinMessageItem overflow-x-hidden">
        <Tooltip content={message.sender.name} placement="left" showArrow>
          <div className="h-full flex flex-col justify-end">
            <Avatar
              src={message.sender.image ?? ""}
              showFallback
              className="w-6 h-6"
            />
          </div>
        </Tooltip>
        <MessageContent
          key={message.id}
          message={message}
          isCurrentUser={false}
          showAction={false}
        />
        <Popover
          placement="top"
          isOpen={isMoreOpen}
          onOpenChange={(open) => setIsMoreOpen(open)}
          showArrow
          classNames={{
            content: "justify-start font-semibold px-2",
          }}
        >
          <PopoverTrigger>
            <div className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer invisible group-hover/pinMessageItem:visible">
              <IoIosMore />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div
              className="w-full rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 text-left"
              onClick={() => handleSeeMessage(message)}
            >
              Xem trong đoạn chat
            </div>
            <div
              className="w-full rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 text-left"
              onClick={handleUnPin}
            >
              Bỏ ghim
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full my-3">
        <Divider />
      </div>
    </div>
  );
}
