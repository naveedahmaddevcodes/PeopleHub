import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { employeeApi } from "./api/employeeApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, employeeApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors (optional)
setupListeners(store.dispatch);
