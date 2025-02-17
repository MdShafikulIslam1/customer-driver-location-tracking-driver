/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { socketEvents } from "@/constant";
import { IShipment } from "@/types";
import { useEffect, useState } from "react";
import ShipmentRequest from "../ShipmentRequest/ShipmentRequest";

type Props = {
  socket: any;
  deliveryAssociate: any;
  setShipmentData: any;
};

const Dashboard = ({ deliveryAssociate, socket, setShipmentData }: Props) => {
  const [newShipmentRequest, setNewShipmentRequest] =
    useState<IShipment | null>(null);

  useEffect(() => {
    socket.on(socketEvents.SHIPMENT_CREATED, (data: any) => {
      console.log("socket shipment created", data);
      setNewShipmentRequest(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAccept = () => {
    alert("shipment accepted");
  };
  const onReject = () => {
    alert("shipment rejected");
    setNewShipmentRequest(null);
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Driver Profile
          </h2>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {deliveryAssociate?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {deliveryAssociate?.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {deliveryAssociate?.phoneNumber}
            </p>
          </div>
        </div>
      </div>

      <div>
        {newShipmentRequest?._id ? (
          <ShipmentRequest onAccept={onAccept} onReject={onReject} />
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
