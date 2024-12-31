import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {  } from "../config";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Define a service using a base URL and expected endpoints
export const loginLayoutApi = createApi({
  reducerPath: "loginLayoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // getLoginLayoutData: builder.query({
    //   query: () => `login-page`,
    // }),

    // getUserProfile: builder.query({
    //   query: () => 'user-profile',
    // }),

    // getNormes: builder.query({
    //   query: ({ endpointName, params }) => {
    //     const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    //     return `${endpointName}${queryString}`;
    //   },
    // }),

    getMachinery:builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return `${endpointName}${queryString}`;
      },
      
      keepUnusedDataFor: 0,
    }),
    getNormeLanguage : builder.query({
      query:({endpointName})=>{
        return endpointName
      },
      keepUnusedDataFor: 0,
    }),
    getNormeStandardType :builder.query({
      query:({endpointName})=>{
        return endpointName
      },
      keepUnusedDataFor: 0,
    }),
    
    // api for Add Norme 
    addNorme: builder.mutation({
      query: (credentials) => {
      
        return {
          url: credentials.url,
          method: credentials.method,
          body: credentials.data,
         //headers: { 'Content-Type': 'application/json' }
        };
      }
    }),

    // api for get the details of edit Norme 
    getEditNormData : builder.query({
      query:({url,params})=>{
        console.log(url,params?.id,"urldata")
        return `${url}${params?.id}`
      },
      keepUnusedDataFor: 0,
    }),

    // api For Delete Norme
    deleteNorm : builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}/${credentials.params}`, 
          method: credentials.method, 
        };
      }
    }),

  /// api For Edit Norme 
    EditNorme: builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}/${credentials.params}`, // Adjust the endpoint as needed
          method: credentials.method,
          body : credentials.data,
          //headers: { 'Content-Type': 'application/json' }
        };
      }
    }),
 // api for add Amhineery
    addMachinery: builder.mutation({
      query: (credentials) => {
      
        return {
          url: credentials.url,
          method: credentials.method,
          body: credentials.data,
         
        };
      }
    }),

    // api for Edit machinery 
    EditMachinery: builder.mutation({
      query: (credentials) => {
        // const queryString = new URLSearchParams(credentials.params.id).toString();
        console.log(credentials,"credentials")
        return {
          url: `${credentials.url}/${credentials.params}`, // Adjust the endpoint as needed
          method: credentials.method,
          body : credentials.data,
          //headers: { 'Content-Type': 'application/json' }
        };
      }
    }),

    /// function for getOrder of Dashbord page
    getInspectionsOrder:builder.query({
      query: ({url,params} ) => {
        const queryString =new URLSearchParams(params).toString()
        return `${url}?${queryString}`;
      },
      
      keepUnusedDataFor: 0,
    }),

     // for calender dashBorad
    getCalender:builder.query({
      query: ({url} ) => {
        return url;
      },
    }),

    // for getorder isPenzione page1
    getOdersIspezione0 :builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return `${endpointName}${queryString}`;
      },
      keepUnusedDataFor: 0,
    }),

    // for getorder isPenzione page2
    getOdersIspezione1 :builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return `${endpointName}${queryString}`;
      },
      keepUnusedDataFor: 0,
    }),

    // api for get dropDownList for add isPenzione
     getAddDropDownList : builder.query({
      query:(endpoints)=>{
        return endpoints;
      }
     }),
      // api for get rzOder in for add isPenzione
      getRzOrder : builder.query({
        query:({url,params})=>{
          return `${url}${params}`;
        },
        keepUnusedDataFor: 0,
       }),
       getMachineryIDOrder : builder.query({
        query:({url,params})=>{
          return `${url}${params}`;
        },
        keepUnusedDataFor: 0,
       }),
      
       createInspection: builder.mutation({
        query: (data) => {
          console.log("data", data); 
          return {
            url: data?.url,
            method: data?.method,
            body: data?.body
          };
        }
      }),
      

      getEditIDOrder: builder.query({
        query: ({ url, params }) => {
          return `${url}${params}`;
        },
        keepUnusedDataFor: 0,
      }),
      

       // api for deleteInspection
       deleInspection: builder.mutation({
        query:(data)=>({
          url : `${data?.url}/${data?.id}`,
          method : data?.method
        })
       }),

       /// api For Edit Norme 
    updateInspection: builder.mutation({
      query: (data) => {
        return {
          url: `${data?.url}/${data?.params}`, 
          method: data?.method,
          body : data?.body,
          //headers: { 'Content-Type': 'application/json' }
        };
      }
    }),

    login: builder.mutation({
        query: (credentials) => ({
          url: credentials.url,  // dynamic URL passed from the request
          method: credentials.method, // dynamic method passed from the request
          body: JSON.stringify(credentials.data), // dynamic body
          headers: { 'Content-Type': 'application/json' },
        }),
      }),
  }),
});

export const {
  useGetMachineryQuery,
  useGetNormeLanguageQuery,
  useGetNormeStandardTypeQuery,
  useAddNormeMutation,
  useEditNormeMutation,
  useDeleteNormMutation,
  useGetEditNormDataQuery,
  useAddMachineryMutation,
  useEditMachineryMutation,
  useGetInspectionsOrderQuery,
  useGetCalenderQuery,
  useGetOdersIspezione0Query,
  useGetOdersIspezione1Query,
  useGetAddDropDownListQuery,
  useGetRzOrderQuery,
  useGetMachineryIDOrderQuery,
  useCreateInspectionMutation,
  useGetEditIDOrderQuery,
  useDeleInspectionMutation,
  useUpdateInspectionMutation,
  useLoginMutation,

} = loginLayoutApi;
