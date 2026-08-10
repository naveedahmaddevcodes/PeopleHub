import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Attach the JWT access token from Redux state to each request
const baseQuery = fetchBaseQuery({
  baseUrl: "/api/employees",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = getState().auth;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  tagTypes: ["Employee"],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params = {}) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Employee", id: _id })),
        { type: "Employee", id: "LIST" },
      ],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    createEmployee: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
