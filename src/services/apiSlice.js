import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {  } from "../config";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Define a service using a base URL and expected endpoints
export const loginLayoutApi = createApi({
  reducerPath: "loginLayoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Accept-Language", "it");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMachinery: builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return `${endpointName}${queryString}`;
      },

      keepUnusedDataFor: 0,
    }),
    getNormeLanguage: builder.query({
      query: ({ endpointName }) => {
        return endpointName;
      },
      keepUnusedDataFor: 0,
    }),
    getNormeStandardType: builder.query({
      query: ({ endpointName }) => {
        return endpointName;
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
      },
    }),

    // api for get the details of edit Norme
    getEditNormData: builder.query({
      query: ({ url, params }) => {
        console.log(url, params?.id, "urldata");
        return `${url}${params?.id}`;
      },
      keepUnusedDataFor: 0,
    }),

    // api for get inspection order data using id
    getInspectionOrderData: builder.query({
      query: ({ url, params }) => {
        return `${url}${params?.id}`;
      },
      keepUnusedDataFor: 0,
    }),

    // get for notificatin lists
    getNotifiche: builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return `${endpointName}${queryString}`;
      },

      keepUnusedDataFor: 0,
    }),

    // api For Delete Norme
    deleteNorm: builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}/${credentials.params}`,
          method: credentials.method,
        };
      },
    }),

    /// api For Edit Norme
    EditNorme: builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}/${credentials.params}`, // Adjust the endpoint as needed
          method: credentials.method,
          body: credentials.data,
          //headers: { 'Content-Type': 'application/json' }
        };
      },
    }),
    // api for add Amhineery
    addMachinery: builder.mutation({
      query: (credentials) => {
        return {
          url: credentials.url,
          method: credentials.method,
          body: credentials.data,
        };
      },
    }),

    // api for Edit machinery
    EditMachinery: builder.mutation({
      query: (credentials) => {
        // const queryString = new URLSearchParams(credentials.params.id).toString();
        console.log(credentials, "credentials");
        return {
          url: `${credentials.url}/${credentials.params}`, // Adjust the endpoint as needed
          method: credentials.method,
          body: credentials.data,
          //headers: { 'Content-Type': 'application/json' }
        };
      },
    }),

    /// function for getOrder of Dashbord page
    getInspectionsOrder: builder.query({
      query: ({ url, params }) => {
        const queryString = new URLSearchParams(params).toString();
        return `${url}?${queryString}`;
      },

      keepUnusedDataFor: 0,
    }),

    // for calender dashBorad
    getCalender: builder.query({
      query: ({ url }) => {
        return url;
      },
    }),

    // delete for notification
    deleteNotifiche: builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}`,
          method: credentials.method,
        };
      },
    }),

    // for getorder isPenzione page1
    getOdersIspezione0: builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return `${endpointName}${queryString}`;
      },
      keepUnusedDataFor: 0,
    }),

    // for getorder isPenzione page2
    getOdersIspezione1: builder.query({
      query: ({ endpointName, params }) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return `${endpointName}${queryString}`;
      },
      keepUnusedDataFor: 0,
    }),

    // api for get dropDownList for add isPenzione
    getAddDropDownList: builder.query({
      query: (endpoints) => {
        return endpoints;
      },
    }),
    // api for get rzOder in for add isPenzione
    getRzOrder: builder.query({
      query: ({ url, params }) => {
        return `${url}${params}`;
      },
      keepUnusedDataFor: 0,
    }),
    getMachineryIDOrder: builder.query({
      query: ({ url, params }) => {
        return `${url}${params}`;
      },
      keepUnusedDataFor: 0,
    }),

    createInspection: builder.mutation({
      query: (data) => {
        return {
          url: "/api/v1/inspections/create-inspection-points",
          method: "POST",
          body: data?.body,
        };
      },
    }),

    getEditIDOrder: builder.query({
      query: ({ url, params }) => {
        return `${url}${params}`;
      },
      keepUnusedDataFor: 0,
    }),

    // api for deleteInspection
    deleInspection: builder.mutation({
      query: (data) => ({
        url: `${data?.url}/${data?.id}`,
        method: data?.method,
      }),
    }),

    /// api For Edit Norme
    updateInspection: builder.mutation({
      query: (data) => {
        return {
          url: `${data?.url}/${data?.params}`,
          method: data?.method,
          body: data?.body,
          //headers: { 'Content-Type': 'application/json' }
        };
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: credentials.url, // dynamic URL passed from the request
        method: credentials.method, // dynamic method passed from the request
        body: JSON.stringify(credentials.data), // dynamic body
        headers: { "Content-Type": "application/json" },
      }),
    }),

    getInspectionConformity: builder.mutation({
      query: (credentials) => {
        return {
          url: `${credentials.url}${credentials.params}`,
          method: credentials.method,
        };
      },
    }),

    // get inspection points
    getInspectionPoints: builder.mutation({
      query: () => ({
        url: "/api/v1/inspections/inspection-points", // dynamic URL passed from the request
        method: "GET", // dynamic method passed from the request
      }),
    }),

    addConformity: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/conformity/add-conformity",
        method: "POST",
        body: formData,
      }),
    }),

    // get Conformity types
    getConformityTypes: builder.query({
      query: (endpoints) => {
        return endpoints?.endpoints;
      },
    }),

    // create cluster
    createCluster: builder.mutation({
      query: (credentials) => ({
        url: credentials.url, // dynamic URL passed from the request
        method: credentials.method, // dynamic method passed from the request
        body: JSON.stringify(credentials.body), // dynamic body
        headers: { "Content-Type": "application/json" },
      }),
    }),

    getConformityData: builder.mutation({
      query: (credentials) => ({
        url: `/api/v1/conformity/get-conformity/${credentials.id}`, // dynamic URL passed from the request
        method: "GET", // dynamic method passed from the request
        headers: { "Content-Type": "application/json" },
      }),
    }),

    editConformity: builder.mutation({
      query: (credentials) => ({
        url: `/api/v1/conformity/edit-conformity/${credentials.id}`, // dynamic URL passed from the request
        method: "PUT", // dynamic method passed from the request
        body: credentials.body, // dynamic body
      }),
    }),

    deleteConformity: builder.mutation({
      query: (credentials) => ({
        url: credentials.url, // dynamic URL passed from the request
        method: credentials.method, // dynamic method passed from the request
        body: credentials.body, // dynamic body
      }),
    }),

    recapConformity: builder.mutation({
      query: (credentials) => ({
        url: credentials.url,
        method: credentials.method,
        body: credentials.body,
      }),
    }),

    deleteConformityData: builder.mutation({
      query: (credentials) => ({
        url: `/api/v1/conformity/delete-conformity/${credentials.params}`,
        method: credentials.method,
      }),
    }),

    updateClientInfo: builder.mutation({
      query: (credentials) => ({
        url: '/api/v1/inspections/update-client-info',
        method: "PUT",
        body: credentials.body,
      }),
    }),

    getRevisionReports: builder.query({
      query: ({ id, params }) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return `/api/v1/report/get-revision-report/${id}${queryString}`;
      },
    }),

    getInspectionOrderData2: builder.mutation({
      query: (credentials) => ({
        url: `${credentials.url}${credentials.params.id}`,
        method: "GET",
      }),
    }),

    openAitext: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/conformity/OpenAI",
        method: "POST",
        body: credentials.body,
      }),
    }),

    generateReports: builder.mutation({
      query: (id) => ({
        url: `/api/v1/report/generate-report/${id}`,
        method: "POST",
      }),
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/api/v1/report/delete-report/${id}`,
        method: "DELETE",
      }),
    }),

    // get notification list dashboard
    getNotificheOverview: builder.query({
      query: (credentials) =>({
        url: credentials?.url,
        method: credentials?.method
      })
    }),
    // get report list dashboard
    getReportDashboard: builder.query({
      query: (credentials) =>({
        url: credentials.url,
        method: credentials.method
      })
    }),
    updateProfile: builder.mutation({
      query: (credentials) =>({
        url: credentials.url,
        method: credentials.method,
        body: credentials.body
      })
    }),
    getUserDetails: builder.query({
      query: (credentials) => ({
        url: credentials.url,
        method: credentials.method,
      }),
      keepUnusedDataFor: 0, 
    }),
    uploadExcel: builder.mutation({
      query: (credentials) =>({
        url: credentials.url,
        method: credentials.method,
        body: credentials.body
      })
    }),
    sendOtp: builder.mutation({
      query: (credentials) =>({
        url: credentials.url,
        method: credentials.method,
        body: credentials.body
      })
    }),
    resetPassword: builder.mutation({
      query: (credentials) =>({
        url: "/api/v1/reset-password",
        method: "POST",
        body: credentials
      })
    }),

    GetDropdownList: builder.query({
      query: (query) => ({
        url: "/api/v1/inspections/getDropdownList",
        method: "GET",
        params: query,
      }),
    }),

    updateArea: builder.mutation({
      query:(Credentials) =>({
        url: `/api/v1/inspections/update-Inspectionmachinery-info/${Credentials?.id}`,
        method: "POST",
        body: Credentials?.body
      })
    }),

    updateStatusPriority: builder.mutation({
      query: (Credentials) =>({
        url: `/api/v1/conformity/change-conformity-status-priority/${Credentials?.id}`,
        method: "POST",
        body: Credentials.body
      })
    }),
    createInspectionData : builder.mutation({
      query: (credentials) =>({
        url: credentials.url,
        method: credentials.method,
        body: credentials.body
      })
    })
  })
});

export const {
  useGetMachineryQuery,
  useGetNormeLanguageQuery,
  useGetNormeStandardTypeQuery,
  useAddNormeMutation,
  useEditNormeMutation,
  useDeleteNormMutation,
  useGetNotificheQuery,
  useGetEditNormDataQuery,
  useAddMachineryMutation,
  useEditMachineryMutation,
  useGetInspectionsOrderQuery,
  useGetCalenderQuery,
  useGetOdersIspezione0Query,
  useDeleteNotificheMutation,
  useGetOdersIspezione1Query,
  useGetAddDropDownListQuery,
  useGetRzOrderQuery,
  useGetMachineryIDOrderQuery,
  useCreateInspectionMutation,
  useGetEditIDOrderQuery,
  useDeleInspectionMutation,
  useUpdateInspectionMutation,
  useLoginMutation,
  useGetInspectionOrderDataQuery,
  useGetInspectionConformityMutation,
  useGetInspectionPointsMutation,
  useAddConformityMutation,
  useGetConformityTypesQuery,
  useCreateClusterMutation,
  useGetConformityDataMutation,
  useEditConformityMutation,
  useDeleteConformityMutation,
  useRecapConformityMutation,
  useDeleteConformityDataMutation,
  useUpdateClientInfoMutation,
  useGetRevisionReportsQuery,
  useGetInspectionOrderData2Mutation,
  useOpenAitextMutation,
  useGenerateReportsMutation,
  useDeleteReportMutation,
  useGetNotificheOverviewQuery,
  useGetReportDashboardQuery,
  useUpdateProfileMutation,
  useGetUserDetailsQuery,
  useUploadExcelMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
  useGetDropdownListQuery,
  useUpdateAreaMutation,
  useUpdateStatusPriorityMutation,
  useCreateInspectionDataMutation
} = loginLayoutApi;
