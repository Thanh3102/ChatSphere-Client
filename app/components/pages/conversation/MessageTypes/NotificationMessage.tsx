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
  let content = <></>;
  switch (message.notificationAction) {
    case "pin":
      content = (
        <>
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
        </>
      );
      break;
    case "unPin":
      content = (
        <>
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
        </>
      );
      break;
    case "changeEmoji":
      content = (
        <div className="flex gap-2">
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã thay đổi biểu tượng cảm xúc thành`}
          <Emoji unified={message.notificationTarget} size={16} />
        </div>
      );
      break;
    case "changeGroupName":
      content = (
        <>
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã đổi tên nhóm chat là ${message.notificationTarget}`}
        </>
      );
      break;
    case "changeGroupImage":
      content = (
        <> {`${isCurrentUser ? "Bạn" : message.sender.name} đã đổi ảnh nhóm`}</>
      );
      break;
    case "addMember":
      content = (
        <>
          {`${isCurrentUser ? "Bạn" : message.sender.name} đã thêm ${
            message.notificationTarget
          } vào nhóm`}
        </>
      );
      break;
    case "removeMember":
      content = (
        <>
          {`${isCurrentUser ? "Bạn" : message.sender.name} đã xóa ${
            message.notificationTarget
          } khỏi nhóm`}
        </>
      );
      break;
    case "promoteMember":
      content = (
        <>
          {`${isCurrentUser ? "Bạn" : message.sender.name} đã thêm ${
            message.notificationTarget
          } làm quản trị viên`}
        </>
      );
      break;
    case "downgradeMember":
      content = (
        <>
          {`${
            isCurrentUser ? "Bạn" : message.sender.name
          } đã xóa quyền quản trị viên của ${message.notificationTarget}`}
        </>
      );
      break;
    case "leftGroup":
      content = <>{`${message.notificationTarget} đã rời khỏi nhóm`}</>;
      break;
    default:
      content = <>Notification mesage - Action: {message.notificationAction}</>;
  }

  return (
    <div
      className={`py-2 px-4 text-xs my-2 rounded-xl w-fit min-w-0 break-words text-gray-500 font-medium`}
    >
      {content}
    </div>
  );
};

export default NotificationMessage;
