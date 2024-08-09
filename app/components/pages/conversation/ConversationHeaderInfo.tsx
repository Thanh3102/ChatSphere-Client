import ConversationUserInfo from "./ConversationUserInfo";

interface Props {
  isGroup?: boolean;
}

export default function ConversationHeaderInfo({isGroup}:Props) {
    if(isGroup){
        return <div>Group member info</div>
    }
    return <ConversationUserInfo/>
}
