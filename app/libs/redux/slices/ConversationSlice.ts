import {
  ConversationBasicInfo,
  ConversationMessage,
} from "@/app/shared/types/conversation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
  conversation: ConversationBasicInfo | undefined;
  replyMessage: ConversationMessage | undefined | null;
  // oldestMessage: ConversationMessage | null | undefined;
  // oldestMediaFile: ConversationFile | null | undefined;
  focusMessage:
    | ({
        clickedAt: number;
      } & ConversationMessage)
    | null;
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
  // oldestMessage: null,
  // oldestMediaFile: null,
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
    setConversation(
      state,
      action: PayloadAction<ConversationBasicInfo>
    ) {
      state.conversation = { ...action.payload, mediaFiles: [] };
      // state.oldestMessage = action.payload.messages[0];
      // state.oldestMediaFile =
      //   action.payload.mediaFiles[action.payload.mediaFiles.length - 1];
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
      action: PayloadAction<{ message: ConversationMessage; clickedAt: number }>
    ) {
      state.focusMessage = {
        ...action.payload.message,
        clickedAt: action.payload.clickedAt,
      };
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
        if (action.payload.type === "file") {
          if (
            action.payload.fileType.startsWith("image") ||
            action.payload.fileType.startsWith("video")
          ) {
            state.conversation.mediaFiles.unshift(action.payload);
          } else {
            //           state.conversation.files.push({
            // id: action.payload.id,
            // createdAt: action.payload.createdAt,
            // fileName: action.payload.fileName,
            // fileSecureURL: action.payload.fileSecureURL,
            // fileSize: action.payload.fileSize,
            // fileType: action.payload.fileType,
            // fileURL: action.payload.fileURL,
          }
        }
      }
    },
    addOldMediaFiles(state, action: PayloadAction<ConversationMessage[]>) {
      if (state.conversation) {
        state.conversation.mediaFiles.push(...action.payload);
        // state.oldestMediaFile = action.payload[action.payload.length - 1];
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
        // state.oldestMessage = messages[0];
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
          // const fileIndex = state.conversation.files.findIndex(
          //   (file) => file.id === action.payload
          // );
          if (mediaFileIndex !== -1) {
            state.conversation.mediaFiles.splice(mediaFileIndex, 1);
          }
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
  setOpenHeaderInfo,
  setOpenPinMessage,
  addNewMessage,
  addOldMessage,
  addOldMediaFiles,
  addNewPinMessage,
  removePinMessage,
  recallMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
