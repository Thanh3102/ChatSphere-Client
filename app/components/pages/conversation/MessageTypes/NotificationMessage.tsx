import { useAppDispatch } from "@/app/libs/hooks";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { setOpenPinMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { Emoji } from "emoji-picker-react";

interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

const NotificationMessage = ({ message, isCurrentUser }: Props) => {
  const dispatch = useAppDispatch();
  switch (message.notificationAction) {
    case "pin":
      return (
        <div
          className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium`}
        >
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã ghim một tin nhắn.`}
          <span
            className="text-blue-500 hover:cursor-pointer hover:underline ml-1"
            onClick={() => {
              dispatch(setOpenPinMessage(true));
            }}
          >
            Xem tất cả
          </span>
        </div>
      );
    case "unPin":
      return (
        <div
          className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium`}
        >
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã bỏ ghim một tin nhắn.`}
          <span
            className="text-blue-500 hover:cursor-pointer hover:underline ml-1"
            onClick={() => {
              dispatch(setOpenPinMessage(true));
            }}
          >
            Xem tất cả
          </span>
        </div>
      );
    case "changeEmoji":
      return (
        <div
          className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium flex gap-2 items-center`}
        >
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã thay đổi biểu tượng cảm xúc thành`}
          <Emoji unified={message.notificationTarget} size={16} />
        </div>
      );
    case "changeGroupName":
      return (
        <div
          className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium flex gap-2 items-center`}
        >
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã đổi tên nhóm chat là ${message.notificationTarget}`}
        </div>
      );
    case "changeGroupImage":
      return (
        <div
          className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium flex gap-2 items-center`}
        >
          {`${isCurrentUser ? "Bạn" : message.sender.name} đã đổi ảnh nhóm`}
        </div>
      );
    default:
      return (
        <div
          className={`py-2 px-4 text-sm my-2 rounded-xl w-fit min-w-0 break-words`}
        >
          Notification mesage - Action: {message.notificationAction}
        </div>
      );
  }
};

export default NotificationMessage;
