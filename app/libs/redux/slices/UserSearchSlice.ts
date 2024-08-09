import { UserBasicInfo } from "@/app/shared/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSearchState {
  searchUserKeyword: string;
  searchUserResult: UserBasicInfo[];
}

const initialState = {
  searchUserKeyword: "",
  searchUserResult: [],
} satisfies UserSearchState as UserSearchState;

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.searchUserKeyword = action.payload;
    },
    setResult(state, action: PayloadAction<UserBasicInfo[]>) {
      state.searchUserResult = action.payload;
    },
  },
});

export const { setResult, setKeyword } = userSearchSlice.actions;
export default userSearchSlice.reducer;
