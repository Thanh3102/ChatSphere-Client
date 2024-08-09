import {
  ConversationBasicInfo,
  ConversationMessage,
} from "@/app/shared/types/conversation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
  conversation: ConversationBasicInfo | undefined;
  replyMessage: ConversationMessage | undefined | null;
  focusMessage: {
    id: string;
    clickedAt: number;
  } | null;
  openInfo: boolean;
  openHeaderInfo: boolean;
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
      action: PayloadAction<{ id: string; clickedAt: number }>
    ) {
      state.focusMessage = action.payload;
    },
    setFileSelectTab(state, action: PayloadAction<"mediaFile" | "file">) {
      state.fileTabSelect = action.payload;
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
  setOpenHeaderInfo,
  setOpenPinMessage,
  addNewMessage,
  addNewPinMessage,
  removePinMessage,
  recallMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
