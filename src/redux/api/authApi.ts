import { tagTypes } from "../tagTypes/tagTypes";
import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

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
    // user sign-in api
    login: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [tagTypes.AUTH],
    }),
    verifyLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/verify-login`,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [tagTypes.AUTH],
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useVerifyLoginMutation } =
  authApi;
