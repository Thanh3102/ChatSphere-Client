import { UserBasicInfo } from "./user";
export type ConversationBasicInfo = {
  id: string;
  lastMessageAt: Date;
  lastMessage: ConversationMessage;
  isGroup: boolean;
  groupName: string;
  groupImage: string;
  members: ConversationMember[];
  messages: ConversationMessage[];
  pinMessages: ConversationMessage[];
  mediaFiles: ConversationMessage[];
  files: ConversationMessage[];
  emoji: string;
};

export type ConversationMember = {
  id: string;
  user: UserBasicInfo;
  addedUser: UserBasicInfo;
  joinedAt: Date;
  role: string;
  nickName?: string;
};

export type ConversationMessage = {
  id: string;
  body: string;
  createdAt: Date;
  recall: boolean;
  type: string;
  status: string;
  isTranfer: boolean;
  isPin: boolean;
  pinnedAt: Date;
  fileType: string;
  fileName: string;
  fileURL: string;
  fileSecureURL: string;
  fileSize: number;
  voiceDuration: number;
  notificationAction: string;
  notificationTarget: string;
  responseMessage: ConversationMessage;
  seen: UserBasicInfo[];
  sender: UserBasicInfo;
};

// export type ConversationFile = {
//   id: string;
//   fileType: string;
//   fileName: string;
//   fileURL: string;
//   fileSecureURL: string;
//   fileSize: number;
//   createdAt: Date,
// };

export type ConversationResponseMessage = {
  id: string;
  body: string;
  recall: boolean;
  type: string;
  sender: UserBasicInfo;
};

export type UserConversation = {
  id: string;
  lastMessageAt: Date;
  isGroup: boolean;
  groupName: string;
  groupImage: string;
  users: UserBasicInfo[];
  lastMessage?: ConversationMessage;
};
