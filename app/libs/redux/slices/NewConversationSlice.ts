import { CHECK_CONVERSATION_EXISTS_ROUTE } from "@/app/shared/constants/ApiRoute";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { UserBasicInfo } from "@/app/shared/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewConservationState {
  members: UserBasicInfo[];
  isExist: boolean;
  conversationId: string | undefined;
  messages: ConversationMessage[];
}

const initialState = {
  members: [],
  isExist: false,
  conversationId: undefined,
  messages: [],
} satisfies NewConservationState as NewConservationState;

const newConservationSlice = createSlice({
  name: "newConservation",
  initialState,
  reducers: {
    addMember(state, action: PayloadAction<UserBasicInfo>) {
      state.members.push(action.payload);
    },
    removeMember(state, action: PayloadAction<UserBasicInfo>) {
      state.members = state.members.filter(
        (member) => member.id !== action.payload.id
      );
    },
    setIsExists(state, action: PayloadAction<boolean>) {
      if (!action.payload) {
        state.messages = [];
        state.conversationId = undefined;
      }
      state.isExist = action.payload;
    },
    setMessages(state, action: PayloadAction<ConversationMessage[]>) {
      state.messages = action.payload;
    },
    setConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
    },
  },
});

export const {
  addMember,
  removeMember,
  setIsExists,
  setMessages,
  setConversationId,
} = newConservationSlice.actions;
export default newConservationSlice.reducer;
