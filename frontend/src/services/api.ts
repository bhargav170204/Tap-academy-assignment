
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['User']
    }),
    me: builder.query({
      query: () => '/auth/me',
      providesTags: ['User']
    }),
    checkin: builder.mutation({ query: () => ({ url: '/attendance/checkin', method: 'POST' }) }),
    checkout: builder.mutation({ query: () => ({ url: '/attendance/checkout', method: 'POST' }) }),
    myHistory: builder.query({ query: (params) => ({ url: '/attendance/my-history', params }) })
  })
});

export const { useLoginMutation, useRegisterMutation, useMeQuery, useCheckinMutation, useCheckoutMutation, useMyHistoryQuery } = api;
