import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: () => ({
        url: 'students',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: 'students',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `students/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `students/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    createExcelCourse: builder.mutation({
      query: (data) => ({
        url: 'student-excel',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const { useGetAllCoursesQuery, useCreateCourseMutation, useEditCourseMutation, useDeleteCourseMutation, useCreateExcelCourseMutation } = courseApi;
