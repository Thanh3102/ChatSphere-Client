import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Tooltip } from "@nextui-org/react";
import { Emoji } from "emoji-picker-react";
import { GiPin } from "react-icons/gi";

interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

const EmojiMessage = ({ message, isCurrentUser }: Props) => {
  return (
    <Tooltip
      content={DateToString(message.createdAt)}
      placement={isCurrentUser ? "left" : "right"}
      closeDelay={0}
    >
      <div className={`relative my-2`}>
        {message.isPin && (
          <div className="absolute -top-2 -right-2 text-red-500 text-lg">
            <GiPin />
          </div>
        )}
        <Emoji unified={message.body} size={30} />
      </div>
    </Tooltip>
  );
};

export default EmojiMessage;
