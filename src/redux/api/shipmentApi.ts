import { tagTypes } from "../tagTypes/tagTypes";
import { baseApi } from "./baseApi";

export const shipmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateShipment: build.mutation({
      query: ({ data, id }) => ({
        url: `shipment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.SHIPMENT],
    }),
  }),
});

export const { useUpdateShipmentMutation } = shipmentApi;
