import { ConversationBasicInfo, UserConversation } from "../types/conversation";

export function getConversationInfo(
  conversation: UserConversation | ConversationBasicInfo | undefined | null,
  currentUserId: string | undefined | null
) {
  let info = {
    name: "Người dùng",
    avatar: "",
    image: ""
  };

  if (!conversation || !currentUserId) {
    return info;
  }

  if (conversation.isGroup) {
    info.avatar = conversation.groupImage;
    if (conversation.groupName) {
      info.name = conversation.groupName;
    } else {
      if (conversation.users.length == 2)
        info.name = `Cuộc trò chuyện nhóm của ${conversation.users[0].name} và ${conversation.users[1].name}`;
      else {
        info.name = `Cuộc trò chuyện nhóm của ${conversation.users[0].name}, ${
          conversation.users[1].name
        } và ${conversation.users.length - 2} người khác`;
      }
    }
  } else {
    const user =
      conversation.users[0].id === currentUserId
        ? conversation.users[1]
        : conversation.users[0];
    (info.avatar = user.image), (info.name = user.name);
  }

  return info;
}
