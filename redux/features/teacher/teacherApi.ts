import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeachers: builder.query({
      query: () => ({
        url: 'teacher',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createTeacher: builder.mutation({
      query: (data) => ({
        url: 'teacher',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    editTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: `teacher/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `teacher/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    createExcelTeacher: builder.mutation({
      query: (data) => ({
        url: 'teacher-excel',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const { useCreateExcelTeacherMutation, useDeleteTeacherMutation, useGetAllTeachersQuery, useCreateTeacherMutation, useEditTeacherMutation } = teacherApi;
