import { Fragment } from "react";
import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Tooltip } from "@nextui-org/react";
import MessageAction from "./MessageAction";
import TextMessage from "./MessageTypes/TextMessage";
import NotificationMessage from "./MessageTypes/NotificationMessage";
import FileMessage from "./MessageTypes/FileMessage";
import EmojiMessage from "./MessageTypes/EmojiMessage";
import VoiceMessage from "./MessageTypes/VoiceMessage";
import RenderIf from "../../ui/RenderIf";

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
  switch (message.type) {
    case "text":
      return <TextMessage message={message} isCurrentUser={isCurrentUser} />;
    case "notification":
      return (
        <NotificationMessage message={message} isCurrentUser={isCurrentUser} />
      );
    case "file":
      return <FileMessage message={message} isCurrentUser={isCurrentUser} />;

    case "voice":
      return <VoiceMessage message={message} isCurrentUser={isCurrentUser} />;

    case "emoji":
      return <EmojiMessage message={message} isCurrentUser={isCurrentUser} />;
    default:
      <span className="text-sm text-gray-100 p-2 rounded-xl border-1 border-gray-100 italic">
        Không thể hiện thị nội dung
      </span>;
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
          <RenderIf
            condition={
              showAction &&
              actionPlacement === "left" &&
              message.type !== "notification"
            }
          >
            <MessageAction message={message} isCurrentUser={isCurrentUser} />
          </RenderIf>

          <MessageType message={message} isCurrentUser={isCurrentUser} />

          <RenderIf
            condition={
              showAction &&
              actionPlacement === "right" &&
              message.type !== "notification"
            }
          >
            <MessageAction
              message={message}
              isCurrentUser={isCurrentUser}
              reverse
            />
          </RenderIf>
        </div>
      )}
    </Fragment>
  );
}
