import { configureStore } from "@reduxjs/toolkit";
import citizensReducer from "./slices/citizens";

const store = configureStore({
  reducer: {
    citizens: citizensReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;

export default store;
