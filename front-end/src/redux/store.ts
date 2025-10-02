import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./features/chat/conversationSlice";
import authSlice from "./features/auth/authSlice";
import activitiesSlice from "./features/userActivities";

export const store = configureStore({
  reducer: {
    message: conversationSlice,
    auth: authSlice,
    activities: activitiesSlice,
  },
  // middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
