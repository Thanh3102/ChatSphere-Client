import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Tooltip } from "@nextui-org/react";
import { GiPin } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";
interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

const FileMessage = ({ message, isCurrentUser }: Props) => {
  if (message.fileType.startsWith("image")) {
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
  }

  if (message.fileType.startsWith("video")) {
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
          <video src={message.fileURL} controls muted className="rounded-xl" />
        </div>
      </Tooltip>
    );
  }

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
};

export default FileMessage;
