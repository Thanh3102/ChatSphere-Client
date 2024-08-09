import { ConversationMessage } from "@/app/shared/types/conversation";
import { Fragment } from "react";
import ConversationPinMessageItem from "./ConversationPinMessageItem";

interface Props {
  pinMessages: ConversationMessage[];
}

export default function ConversationPinMessageList({ pinMessages }: Props) {
  if (pinMessages.length !== 0) {
    return (
      <div className="h-[400px] w-full overflow-y-auto">
        {pinMessages.map((msg) => (
          <ConversationPinMessageItem message={msg} key={msg.id}/>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-[400px]">
      Không có tin nhắn ghim nào
    </div>
  );
}
