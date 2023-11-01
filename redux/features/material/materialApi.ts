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
  }),
});

export const { useCreateMaterialMutation, useDeleteMaterialMutation, useEditMaterialMutation, useGetAllMaterialQuery } = materialApi;
