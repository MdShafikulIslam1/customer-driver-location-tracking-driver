import { tagTypes } from "../tagTypes/tagTypes";
import { baseApi } from "./baseApi";
const AUTH_URL = "/user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    signUp: build.mutation({
      query: (signUpData) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: signUpData,
      }),
      invalidatesTags: [tagTypes.AUTH],
    }),
    verifyDeliveryAssociateLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/delivery-associate-verify-login`,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [tagTypes.AUTH],
    }),

    getDeliveryAssociate: build.query({
      query: (id: string) => ({
        url: `/deliveryAssociate/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.AUTH],
    }),
  }),
});

export const {
  useSignUpMutation,
  useVerifyDeliveryAssociateLoginMutation,
  useGetDeliveryAssociateQuery,
} = authApi;
