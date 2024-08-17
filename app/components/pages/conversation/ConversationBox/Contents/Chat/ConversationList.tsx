import { UserConversation } from "@/app/shared/types/conversation";
import ConversationListItem from "./ConversationListItem";

interface Props {
  conversations: UserConversation[];
}

export default function ConversationList({ conversations }: Props) {  
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden mt-2 max-w-full no-scrollbar">
      {conversations.map((con) => (
        <ConversationListItem conversation={con} key={con.id} />
      ))}
    </div>
  );
}
