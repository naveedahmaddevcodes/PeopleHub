import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL points to the backend (proxied via vite config /api -> localhost:5000)
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    credentials: "include", // send httpOnly refresh cookie
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
