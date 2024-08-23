import ConversationGroupInfo from "./ConversationGroupInfo";
import ConversationUserInfo from "./ConversationUserInfo";

interface Props {
  isGroup?: boolean;
}

export default function ConversationHeaderInfo({isGroup}:Props) {
    if(isGroup){
        return <ConversationGroupInfo/>
    }
    return <ConversationUserInfo/>
}
