import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  token: Cookies.get("token") || null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set("token", action.payload, { expires: 1 });
    },
    clearToken: (state) => {
      state.token = null;
      Cookies.remove("token");
    },
  },
});

export const { setToken, clearToken } = loginSlice.actions;
export default loginSlice.reducer;
