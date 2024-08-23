import { useAppDispatch } from "@/app/libs/hooks";
import { setFocusMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Emoji } from "emoji-picker-react";
import { Fragment } from "react";
import { GrAttachment } from "react-icons/gr";
import { ImReply } from "react-icons/im";

interface Props {
  message: ConversationMessage;
  currentUserId: string;
}

export default function ReplyContent({ message, currentUserId }: Props) {
  const dispatch = useAppDispatch();

  const isCurrentUserSend = message.sender.id === currentUserId;

  let responsedName = "";
  if (
    message.responseMessage.sender.id === currentUserId &&
    message.sender.id !== currentUserId
  ) {
    responsedName = "bạn";
  } else if (
    message.sender.id === message.responseMessage.sender.id ||
    currentUserId === message.responseMessage.sender.id
  ) {
    responsedName = "chính mình";
  } else {
    responsedName = message.responseMessage.sender.name;
  }

  return (
    <Fragment>
      <div className="flex gap-2 items-center py-2 text-xs text-gray-500 font-medium ">
        <ImReply />
        <span className="max-w-[400px] text-ellipsis whitespace-nowrap overflow-hidden inline-block">
          {`${
            isCurrentUserSend ? "Bạn" : message.sender.name
          } đang trả lời ${responsedName}`}
        </span>
      </div>
      <div
        className="py-2 px-3 bg-gray-200 rounded-xl w-fit relative max-w-full text-ellipsis whitespace-nowrap overflow-hidden pb-3 -mb-5 hover:cursor-pointer"
        onClick={() =>
          dispatch(
            setFocusMessage({
              message: message.responseMessage,
              clickedAt: Date.now(),
            })
          )
        }
      >
        {message.responseMessage.recall ? (
          <span className="text-sm italic text-gray-400">
            Tin nhắn đã được thu hồi
          </span>
        ) : message.responseMessage.type === "text" ? (
          <span className="text-sm">{message.responseMessage.body}</span>
        ) : message.responseMessage.type === "text" ? (
          <span className="italic text-sm flex items-center gap-2">
            <GrAttachment />
            File đính kèm
          </span>
        ) : (
          <Emoji unified={message.responseMessage.body} size={16} />
        )}
      </div>
    </Fragment>
  );
}
