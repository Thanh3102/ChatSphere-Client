import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export enum SelectContent {
  CHAT = "Đoạn chat",
  PEOPLE = "Mọi người",
  REQUEST = "Yêu cầu",
  ARCHIVE = "Lưu trữ",
}

interface AppState {
  contentBoxSelect: SelectContent;
  selectConversationId: string | undefined;
}

const initialState = {
  contentBoxSelect: SelectContent.CHAT,
  selectConversationId: undefined,
} satisfies AppState as AppState;

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeSelect(state, action) {
      state.contentBoxSelect = action.payload;
      state.selectConversationId = undefined;
    },
    changeConvervation(state, action) {
      state.selectConversationId = action.payload;
    },
  },
});

export const { changeSelect, changeConvervation } = appSlice.actions;
export default appSlice.reducer;
