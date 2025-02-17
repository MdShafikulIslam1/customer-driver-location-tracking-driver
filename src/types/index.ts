import { ShipmentStatus } from "@/enum";

export interface ILocation {
  lat: number;
  lng: number;
}

export interface IShipment {
  _id: string;
  customerLocation: ILocation;
  userId: string;
  status: ShipmentStatus;
  deliveryAssociateId?: string;
}
