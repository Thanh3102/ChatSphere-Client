import {
  ConversationBasicInfo,
  ConversationMember,
  ConversationMessage,
} from "@/app/shared/types/conversation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
  conversation: ConversationBasicInfo | undefined;
  replyMessage: ConversationMessage | undefined | null;
  focusMessage:
    | ({
        clickedAt: number;
      } & ConversationMessage)
    | null;
  openInfo: boolean;
  openHeaderInfo: boolean;
  openAddMember: boolean;
  openPinMessage: boolean;
  openFileList: boolean;
  fileTabSelect: "file" | "mediaFile";
}

const initialState = {
  conversation: undefined,
  replyMessage: null,
  focusMessage: null,
  openInfo: true,
  openHeaderInfo: false,
  openAddMember: false,
  openPinMessage: false,
  openFileList: false,
  fileTabSelect: "mediaFile",
} satisfies ConversationState as ConversationState;

const conversationSlice = createSlice({
  name: "Conversation",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<ConversationBasicInfo>) {
      state.conversation = action.payload;
    },
    setMessages(state, action: PayloadAction<ConversationMessage[]>) {
      if (state.conversation) {
        state.conversation = {
          ...state.conversation,
          messages: action.payload,
        };
      }
    },
    setReplyMessage(state, action: PayloadAction<ConversationMessage | null>) {
      state.replyMessage = action.payload;
    },
    setFocusMessage(
      state,
      action: PayloadAction<{
        message: ConversationMessage;
        clickedAt: number;
      } | null>
    ) {
      if (action.payload) {
        state.focusMessage = {
          ...action.payload.message,
          clickedAt: action.payload.clickedAt,
        };
      } else {
        state.focusMessage = null;
      }
    },
    setFileSelectTab(state, action: PayloadAction<"mediaFile" | "file">) {
      state.fileTabSelect = action.payload;
    },
    setOpenAddMember(state, action: PayloadAction<boolean>) {
      state.openAddMember = action.payload;
    },
    setOpenInfo(state, action: PayloadAction<boolean>) {
      state.openInfo = action.payload;
    },
    setOpenHeaderInfo(state, action: PayloadAction<boolean>) {
      state.openHeaderInfo = action.payload;
    },
    setOpenPinMessage(state, action: PayloadAction<boolean>) {
      state.openPinMessage = action.payload;
    },
    setOpenFileList(state, action: PayloadAction<boolean>) {
      state.openFileList = action.payload;
    },
    addNewMessage(state, action: PayloadAction<ConversationMessage>) {
      if (state.conversation) {
        state.conversation.messages.push(action.payload);
        if (action.payload.type === "file") {
          if (
            action.payload.fileType.startsWith("image") ||
            action.payload.fileType.startsWith("video")
          ) {
            state.conversation.mediaFiles.unshift(action.payload);
          } else {
            state.conversation.files.unshift(action.payload);
          }
        }
      }
    },
    addOldMediaFiles(state, action: PayloadAction<ConversationMessage[]>) {
      if (state.conversation) {
        state.conversation.mediaFiles.push(...action.payload);
      }
    },
    addOldFiles(state, action: PayloadAction<ConversationMessage[]>) {
      if (state.conversation) {
        state.conversation.files.push(...action.payload);
      }
    },
    addOldMessage(
      state,
      action: PayloadAction<{
        messages: ConversationMessage[];
        focusMessage?: ConversationMessage;
      }>
    ) {
      const { messages, focusMessage } = action.payload;
      if (state.conversation) {
        state.conversation.messages.unshift(...messages);
        if (focusMessage) {
          state.focusMessage = { ...focusMessage, clickedAt: Date.now() };
        }
      }
    },
    addNewPinMessage(state, action: PayloadAction<ConversationMessage>) {
      if (state.conversation) {
        state.conversation.pinMessages = [
          action.payload,
          ...state.conversation.pinMessages,
        ];
        const messageIndex = state.conversation.messages.findIndex(
          (msg) => msg.id === action.payload.id
        );
        if (messageIndex !== -1) {
          state.conversation.messages[messageIndex].isPin = true;
        }
      }
    },
    removePinMessage(state, action: PayloadAction<ConversationMessage>) {
      if (state.conversation) {
        const pinMessageIndex = state.conversation.pinMessages.findIndex(
          (msg) => msg.id === action.payload.id
        );
        if (pinMessageIndex !== -1) {
          state.conversation.pinMessages.splice(pinMessageIndex, 1);
        }
        const messageIndex = state.conversation.messages.findIndex(
          (msg) => msg.id === action.payload.id
        );
        if (messageIndex !== -1) {
          state.conversation.messages[messageIndex].isPin = false;
        }
      }
    },
    recallMessage(state, action: PayloadAction<string>) {
      if (state.conversation) {
        state.conversation.messages.forEach((message, index) => {
          if (state.conversation && message.id === action.payload) {
            state.conversation.messages[index].recall = true;
          }
          if (
            state.conversation &&
            message.responseMessage &&
            message.responseMessage.id === action.payload
          ) {
            state.conversation.messages[index].responseMessage.recall = true;
          }
        });
        if (state.conversation.mediaFiles.length !== 0) {
          const mediaFileIndex = state.conversation.mediaFiles.findIndex(
            (file) => file.id === action.payload
          );
          const fileIndex = state.conversation.files.findIndex(
            (file) => file.id === action.payload
          );
          if (mediaFileIndex !== -1) {
            state.conversation.mediaFiles.splice(mediaFileIndex, 1);
          }
          if (fileIndex !== -1) {
            state.conversation.files.splice(fileIndex, 1);
          }
        }
      }
    },
    changeEmoji(state, action: PayloadAction<string>) {
      if (state.conversation) {
        state.conversation.emoji = action.payload;
      }
    },
    changeGroupName(state, action: PayloadAction<string>) {
      if (state.conversation) {
        state.conversation.groupName = action.payload;
      }
    },
    changeGroupImage(state, action: PayloadAction<string>) {
      if (state.conversation) {
        state.conversation.groupImage = action.payload;
      }
    },
    addNewMember(state, action: PayloadAction<ConversationMember>) {
      if (state.conversation) {
        state.conversation.members.push(action.payload);
      }
    },
    removeMember(state, action: PayloadAction<ConversationMember>) {
      if (state.conversation) {
        const index = state.conversation.members.findIndex(
          (member) => member.id === action.payload.id
        );
        if (index !== -1) {
          state.conversation.members.splice(index, 1);
        }
      }
    },
    promoteMember(state, action: PayloadAction<string>) {
      if (state.conversation) {
        const index = state.conversation.members.findIndex(
          (member) => member.id === action.payload
        );
        if (index !== -1) {
          state.conversation.members[index].role = "admin";
        }
      }
    },
    downgradeMember(state, action: PayloadAction<string>) {
      if (state.conversation) {
        const index = state.conversation.members.findIndex(
          (member) => member.id === action.payload
        );
        if (index !== -1) {
          state.conversation.members[index].role = "member";
        }
      }
    },
    memberLeft(state, action: PayloadAction<string>) {
      if (state.conversation) {
        const index = state.conversation.members.findIndex(
          (member) => member.id === action.payload
        );
        if (index !== -1) {
          state.conversation.members.splice(index, 1);
        }
      }
    },
  },
});

export const {
  setConversation,
  setMessages,
  setReplyMessage,
  setFocusMessage,
  setFileSelectTab,
  setOpenFileList,
  setOpenInfo,
  setOpenAddMember,
  setOpenHeaderInfo,
  setOpenPinMessage,
  addNewMessage,
  addOldMessage,
  addOldMediaFiles,
  addOldFiles,
  addNewPinMessage,
  removePinMessage,
  recallMessage,
  changeEmoji,
  changeGroupName,
  changeGroupImage,
  addNewMember,
  removeMember,
  promoteMember,
  downgradeMember,
  memberLeft
} = conversationSlice.actions;
export default conversationSlice.reducer;
