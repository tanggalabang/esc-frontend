import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommentAssignment: builder.query({
      query: () => ({
        url: 'comment-assignment',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createCommentAssignment: builder.mutation({
      query: (data) => ({
        url: 'comment-assignment',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    // editTeacher: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `teacher/${id}`,
    //     method: 'PUT',
    //     body: data,
    //     credentials: 'include' as const,
    //   }),
    // }),
    // deleteTeacher: builder.mutation({
    //   query: (id) => ({
    //     url: `teacher/${id}`,
    //     method: 'DELETE',
    //     credentials: 'include' as const,
    //   }),
    // }),
    // createExcelTeacher: builder.mutation({
    //   query: (data) => ({
    //     url: 'teacher-excel',
    //     method: 'POST',
    //     body: data,
    //     credentials: 'include' as const,
    //   }),
    // }),
  }),
});

export const { useGetAllCommentAssignmentQuery, useCreateCommentAssignmentMutation } = commentApi;
