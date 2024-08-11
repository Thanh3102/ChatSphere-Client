import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";
import MessageAction from "./MessageAction";
import { Fragment } from "react";
import { useAppDispatch } from "@/app/libs/hooks";
import { setOpenPinMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { GiPin } from "react-icons/gi";

interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
  actionPlacement?: "left" | "right";
  showAction?: boolean;
}

interface MessageTypeProps {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

function MessageType({ message, isCurrentUser }: MessageTypeProps) {
  const dispatch = useAppDispatch();

  switch (message.type) {
    case "text":
      return (
        <Tooltip
          content={DateToString(message.createdAt)}
          placement={isCurrentUser ? "left" : "right"}
          closeDelay={0}
        >
          <div
            className={`relative py-2 px-4 text-sm my-2 rounded-xl w-full min-w-0 break-words ${
              isCurrentUser
                ? "text-white bg-blue-500"
                : "text-black bg-stone-100"
            } `}
          >
            {message.isPin && (
              <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                <GiPin />
              </div>
            )}
            {message.body}
          </div>
        </Tooltip>
      );
    case "notification":
      switch (message.body) {
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
        default:
          return (
            <div
              className={`py-2 px-4 text-sm my-2 rounded-xl w-fit min-w-0 break-words`}
            >
              Notification mesage: Type: {message.body}
            </div>
          );
      }
    case "file":
      switch (message.fileType) {
        case "image":
          if (message.fileName.endsWith("pdf")) {
            return (
              <Link href={message.fileURL} target="_blank">
                <Tooltip
                  content={DateToString(message.createdAt)}
                  placement={isCurrentUser ? "left" : "right"}
                >
                  <div className="h-14 py-2 px-3 bg-gray-300 rounded-xl flex items-center gap-1 relative my-2">
                    {message.isPin && (
                      <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                        <GiPin />
                      </div>
                    )}
                    <div className="rounded-full p-2 bg-white">
                      <FaRegFileAlt className="text-base" />
                    </div>
                    <p className="w-full line-clamp-2 text-xs font-semibold">
                      {message.fileName}
                    </p>
                  </div>
                </Tooltip>
              </Link>
            );
          }
          return (
            <Link href={message.fileURL} target="_blank">
              {message.isPin && (
                <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                  <GiPin />
                </div>
              )}
              <Tooltip
                content={DateToString(message.createdAt)}
                placement={isCurrentUser ? "left" : "right"}
              >
                <Image
                  src={message.fileURL}
                  alt=""
                  width={200}
                  height={200}
                  className="rounded-xl my-2"
                />
              </Tooltip>
            </Link>
          );
        case "video":
          return (
            <Tooltip
              content={DateToString(message.createdAt)}
              placement={isCurrentUser ? "left" : "right"}
              closeDelay={0}
            >
              <div className="max-w-[300px] min-w-[100px] mt-2 relative">
                {message.isPin && (
                  <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                    <GiPin />
                  </div>
                )}
                <video
                  src={message.fileURL}
                  controls
                  muted
                  className="rounded-xl"
                />
              </div>
            </Tooltip>
          );
        case "voice":
          return (
            <Tooltip
              content={DateToString(message.createdAt)}
              placement={isCurrentUser ? "left" : "right"}
              closeDelay={0}
            >
              <div
                className={`relative y-2 px-4 text-sm my-2 rounded-xl w-fit min-w-0 break-words ${
                  isCurrentUser
                    ? "text-white bg-blue-500"
                    : "text-black bg-stone-100"
                } `}
              >
                {message.isPin && (
                  <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                    <GiPin />
                  </div>
                )}
                {`Tin nhắn dạng voice`}
              </div>
            </Tooltip>
          );
        case "raw":
          return (
            <Link href={message.fileURL} target="_blank">
              <Tooltip
                content={DateToString(message.createdAt)}
                placement={isCurrentUser ? "left" : "right"}
              >
                <div className="h-14 py-2 px-3 bg-gray-300 rounded-xl flex items-center gap-1 relative my-2">
                  {message.isPin && (
                    <div className="absolute -top-2 -right-2 text-red-500 text-lg">
                      <GiPin />
                    </div>
                  )}
                  <div className="rounded-full p-2 bg-white">
                    <FaRegFileAlt className="text-base" />
                  </div>
                  <p className="w-full line-clamp-2 text-xs font-semibold">
                    {message.fileName}
                  </p>
                </div>
              </Tooltip>
            </Link>
          );
        default:
          return (
            <span className="p-2 text-sm rounded-xl text-gray-100">
              Không thể hiện thị nội dung
            </span>
          );
      }
  }
}

export default function MessageContent({
  isCurrentUser,
  message,
  actionPlacement = "left",
  showAction = true,
}: Props) {
  return (
    <Fragment>
      {message.recall ? (
        <Tooltip
          content={DateToString(message.createdAt)}
          placement={`${isCurrentUser ? "left" : "right"}`}
        >
          <span
            className={`py-2 px-4 text-sm my-2 rounded-xl w-fit italic text-gray-400 border-1 border-gray-500`}
          >
            Tin nhắn đã được thu hồi
          </span>
        </Tooltip>
      ) : (
        <div
          className={`relative z-10 flex items-center w-fit max-w-full min-w-0 gap-2 ${
            isCurrentUser ? "justify-end" : ""
          }`}
        >
          {showAction &&
            actionPlacement === "left" &&
            message.type !== "notification" && (
              <MessageAction message={message} isCurrentUser={isCurrentUser} />
            )}
          <MessageType message={message} isCurrentUser={isCurrentUser} />
          {showAction &&
            actionPlacement === "right" &&
            message.type !== "notification" && (
              <MessageAction
                message={message}
                isCurrentUser={isCurrentUser}
                reverse
              />
            )}
        </div>
      )}
    </Fragment>
  );
}
