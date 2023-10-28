import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: 'change-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
        credentials: 'include' as const,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: 'update-profile',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getUserLogin: builder.query({
      query: () => ({
        url: 'user',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deletePic: builder.mutation({
      query: (data) => ({
        url: 'delete-pic',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    // editCourse: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `students/${id}`,
    //     method: 'PUT',
    //     body: data,
    //     credentials: 'include' as const,
    //   }),
    // }),
    // deleteCourse: builder.mutation({
    //   query: (id) => ({
    //     url: `students/${id}`,
    //     method: 'DELETE',
    //     credentials: 'include' as const,
    //   }),
    // }),
    // createExcelCourse: builder.mutation({
    //   query: (data) => ({
    //     url: 'student-excel',
    //     method: 'POST',
    //     body: data,
    //     credentials: 'include' as const,
    //   }),
    // }),
  }),
});

export const { useGetUserLoginQuery, useDeletePicMutation, useUpdatePasswordMutation, useUpdateProfileMutation } = userApi;
