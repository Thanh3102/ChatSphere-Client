import { ConversationBasicInfo, UserConversation } from "../types/conversation";

export function getConversationInfo(
  conversation: ConversationBasicInfo | undefined | null,
  currentUserId: string | undefined | null
) {
  let info = {
    name: "Người dùng",
    avatar: "",
    image: "",
  };

  if (!conversation || !currentUserId) {
    return info;
  }

  if (conversation.isGroup) {
    info.avatar = conversation.groupImage;
    if (conversation.groupName) {
      info.name = conversation.groupName;
    } else {
      if (conversation.members.length == 2)
        info.name = `Cuộc trò chuyện nhóm của ${conversation.members[0].user.name} và ${conversation.members[1].user.name}`;
      else {
        info.name = `Cuộc trò chuyện nhóm của ${
          conversation.members[0].user.name
        }, ${conversation.members[1].user.name} và ${
          conversation.members.length - 2
        } người khác`;
      }
    }
  } else {
    const member =
      conversation.members[0].user.id === currentUserId
        ? conversation.members[1]
        : conversation.members[0];
    (info.avatar = member.user.image), (info.name = member.user.name);
  }

  return info;
}
