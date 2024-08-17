import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Tooltip } from "@nextui-org/react";
import { GiPin } from "react-icons/gi";

interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

const TextMessage = ({ message, isCurrentUser }: Props) => {
  return (
    <Tooltip
      content={DateToString(message.createdAt)}
      placement={isCurrentUser ? "left" : "right"}
      closeDelay={0}
    >
      <div
        className={`relative py-2 px-4 text-sm my-2 rounded-xl w-full min-w-0 break-words ${
          isCurrentUser ? "text-white bg-blue-500" : "text-black bg-stone-100"
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
};

export default TextMessage;
