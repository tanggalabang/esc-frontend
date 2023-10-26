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

export const { useGetAllTeachersQuery, useCreateTeacherMutation } = teacherApi;
