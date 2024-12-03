// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// //import { BASE_URL } from "../config";
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// export const getApi = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getData: builder.query({
//       query: ({ endpointName, params }) => {
//         const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
//         return `${endpointName}${queryString}`;
//       },
//     }),
//     // dynamicRequest: builder.mutation({
//     //   query: ({ endpointName, method, body, params }) => {
//     //     const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
//     //     return {
//     //       url: `${endpointName}${queryString}`,
//     //       method: method, 
//     //       body,
//     //     };
//     //   },
//     // }),
//   }),
// });

// export const { 
//   useGetDataQuery, 
//   //useDynamicRequestMutation
//  } = getApi;

