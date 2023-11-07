import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const studentWorkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createStudentWork: builder.mutation({
      query: (data) => ({
        url: 'student-work',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    addScoreStudentWork: builder.mutation({
      query: ({ data, id }) => ({
        url: `student-work/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllStudentWork: builder.query({
      query: () => ({
        url: 'student-work',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllStudentWorkForTeacher: builder.query({
      query: () => ({
        url: 'teacher-student-work',
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
  }),
});

export const { useGetAllStudentWorkForTeacherQuery, useAddScoreStudentWorkMutation, useGetAllStudentWorkQuery, useCreateStudentWorkMutation } = studentWorkApi;
