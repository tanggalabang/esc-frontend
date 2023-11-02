import { apiSlice } from '../api/apiSlice';
// import axios from '../../../pages/lib/axios';

// const attachCsrfToken = async () => {
//   await axios.get('http://localhost/sanctum/csrf-cookie');
// };

//menambah endpoin pada apiSlice
export const classSubjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClass: builder.query({
      query: () => ({
        url: 'class',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllClassByTeacher: builder.query({
      query: () => ({
        url: 'class-teacher',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: 'class',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    editClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `class/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `class/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    // subject
    getAllSubject: builder.query({
      query: () => ({
        url: 'subject',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllSubjectByTeacher: builder.query({
      query: () => ({
        url: 'subject-teacher',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createSubject: builder.mutation({
      query: (data) => ({
        url: 'subject',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    editSubject: builder.mutation({
      query: ({ id, data }) => ({
        url: `subject/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `subject/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useGetAllClassByTeacherQuery,
  useGetAllSubjectByTeacherQuery,
  useGetAllClassQuery,
  useCreateClassMutation,
  useEditClassMutation,
  useDeleteClassMutation,
  useCreateSubjectMutation,
  useEditSubjectMutation,
  useDeleteSubjectMutation,
  useGetAllSubjectQuery,
} = classSubjectApi;
