import { apiSlice } from '../api/apiSlice';

//menambah endpoin pada apiSlice
export const timesTableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTimeTable: builder.query({
      query: (classId) => ({
        url: `times-table/${classId}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    createTimeTable: builder.mutation({
      query: (data) => ({
        url: 'times-table',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllT: builder.query({
      query: () => ({
        url: 'times-table',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const { useGetAllTQuery, useGetAllTimeTableQuery, useCreateTimeTableMutation } = timesTableApi;
