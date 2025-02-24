"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
import MapComponent from "@/components/MapComponent/MapComponent";
import { socketEvents } from "@/constant";
import { useGetDeliveryAssociateQuery } from "@/redux/api/authApi";
import { ILocation, IShipment } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import io from "socket.io-client";

const socket = io("https://bkend.solar-ict.com", {
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

  // socket connection on off
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

  // driver location change event
  // GPS changed for driver
  const driverLocationChanged = (driverLocation: ILocation) => {
    console.log("driverLocationChanged handler ",driverLocation)
    if (deliveryAssociate?._id) {
      const data = {
        id: deliveryAssociate?._id,
        location: driverLocation
        
      };
      // Send driver location to server
      socket.emit(socketEvents.UPDATE_DA_LOCATION, data);
    }
  };

 // ✅ shipmentData থাকলে কাস্টমার লোকেশন সেট করুন
 const customerLocation = shipmentData?._id ? shipmentData.customerLocation : null;

  return (
    <div className="grid grid-cols-4">
      {/* delivery details */}
      <div className="col-span-4 md:col-span-1">
        <Dashboard
          socket={socket}
          deliveryAssociate={deliveryAssociate}
          setShipmentData={setShipmentData}
        />
      </div>
      {/* show google map in UI */}
      {/* Google Map */}
      <div className="col-span-4 md:col-span-3 h-screen">
        <MapComponent driverLocationChanged={driverLocationChanged}  customerLocation={customerLocation} />
      </div>
    </div>
  );
};

export default DeliveryAssociatePage;
