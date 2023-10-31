import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssignment: builder.query({
      query: () => ({
        url: 'teacher-assignment',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createAssignment: builder.mutation({
      query: (data) => ({
        url: 'teacher-assignment',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    createFiles: builder.mutation({
      query: ({ data, ass_uid }) => ({
        url: `files/${ass_uid}`,
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllFiles: builder.query({
      query: () => ({
        url: 'files',
        method: 'GET',
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

export const { useGetAllFilesQuery, useCreateFilesMutation, useGetAllAssignmentQuery, useCreateAssignmentMutation } = assignmentApi;
