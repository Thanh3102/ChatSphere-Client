import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./slices/AppSlice";
import NewConversationReducer from "./slices/NewConversationSlice";
import UserSearchReducer from "./slices/UserSearchSlice";
import ConversationReducer from "./slices/ConversationSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: AppReducer,
      newConversation: NewConversationReducer,
      conversation: ConversationReducer,
      userSearch: UserSearchReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
