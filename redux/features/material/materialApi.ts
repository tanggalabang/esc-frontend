import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const materialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMaterial: builder.query({
      query: () => ({
        url: 'teacher-material',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    editMaterial: builder.mutation({
      query: (data) => ({
        url: 'teacher-material-edit',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    createMaterial: builder.mutation({
      query: (data) => ({
        url: 'teacher-material',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `teacher-material/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),

    // student
    getAllMaterialByStudent: builder.query({
      query: () => ({
        url: 'material-student',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllMaterialByTeacher: builder.query({
      query: () => ({
        url: 'material-teacher',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const { useGetAllMaterialByTeacherQuery, useGetAllMaterialByStudentQuery, useCreateMaterialMutation, useDeleteMaterialMutation, useEditMaterialMutation, useGetAllMaterialQuery } = materialApi;
