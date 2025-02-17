"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
import MapComponent from "@/components/MapComponent/MapComponent";
import { useGetDeliveryAssociateQuery } from "@/redux/api/authApi";
import { IShipment } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const DeliveryAssociatePage = () => {
  const session = useSession();
  const userId = session?.data?.user?._id as string;
  const [shipmentData, setShipmentData] = useState<IShipment | null>(null);

  const { data, isLoading } = useGetDeliveryAssociateQuery(userId, {
    skip: !userId,
  });

  const deliveryAssociate = data?.data;

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Establish Socket
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  return (
    <div className="grid grid-cols-4">
      {/* delivery details */}
      <div>
        <Dashboard
          socket={socket}
          deliveryAssociate={deliveryAssociate}
          setShipmentData={setShipmentData}
        />
      </div>
      {/* show google map in UI */}
      {/* Google Map */}
      <div className="col-span-3 h-screen">
        <MapComponent />
      </div>
    </div>
  );
};

export default DeliveryAssociatePage;
