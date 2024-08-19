import { ConversationMessage } from "@/app/shared/types/conversation";
import { Avatar, Tooltip } from "@nextui-org/react";
import MessageContent from "./MessageContent";
import { useAppDispatch } from "@/app/libs/hooks";
import { setReplyMessage } from "@/app/libs/redux/slices/ConversationSlice";
import ReplyContent from "./ReplyContent";
import { forwardRef } from "react";
import RenderIf from "../../ui/RenderIf";

interface Props {
  message: ConversationMessage;
  currentUserId: string | null | undefined;
}
const ConversationMessageItem = forwardRef<HTMLDivElement, Props>(
  ({ message, currentUserId }: Props, ref) => {
    const isCurrentUser = message.sender.id === currentUserId;
    if (currentUserId) {
      return (
        <div
          ref={ref}
          className={`${
            isCurrentUser
              ? message.type === "notification"
                ? "justify-center"
                : "justify-end"
              : message.type === "notification"
              ? "justify-center"
              : ""
          } flex items-center gap-2 group/messageItem`}
        >
          <div
            className={`${
              !isCurrentUser
                ? message.type === "notification"
                  ? "justify-center"
                  : "flex gap-2 items-center"
                : ""
            } min-w-0 max-w-[calc(100%-40px)]`}
          >
            <RenderIf
              condition={!isCurrentUser && message.type !== "notification"}
            >
              <Tooltip content={message.sender.name}>
                <div className="min-w-fit">
                  <Avatar showFallback src={message.sender.image ?? ""} />
                </div>
              </Tooltip>
            </RenderIf>

            <div
              className={`flex flex-col max-w-full ${
                isCurrentUser ? "items-end" : ""
              }`}
            >
              <RenderIf condition={message.responseMessage && !message.recall}>
                <ReplyContent message={message} currentUserId={currentUserId} />
              </RenderIf>

              <MessageContent
                message={message}
                isCurrentUser={isCurrentUser}
                actionPlacement={`${isCurrentUser ? "left" : "right"}`}
              />
            </div>
          </div>
        </div>
      );
    }
    return <>Không thể hiển thị tin nhắn này</>;
  }
);

export default ConversationMessageItem;
