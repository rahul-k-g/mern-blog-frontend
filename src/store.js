import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducers/loginSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

export default store;
