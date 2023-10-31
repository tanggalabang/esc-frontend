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
    editAssignment: builder.mutation({
      query: (data) => ({
        url: 'teacher-assignment-edit',
        method: 'POST',
        body: data,
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
    editFiles: builder.mutation({
      query: ({ data, ass_uid }) => ({
        url: `files-edit/${ass_uid}`,
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
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `teacher-assignment/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `files/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useDeleteAssignmentMutation,
  useDeleteFileMutation,
  useEditAssignmentMutation,
  useEditFilesMutation,
  useGetAllFilesQuery,
  useCreateFilesMutation,
  useGetAllAssignmentQuery,
  useCreateAssignmentMutation,
} = assignmentApi;
