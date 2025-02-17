"use client";

interface Props {
  onAccept: () => void;
  onReject: () => void;
}

const ShipmentRequest = ({ onAccept, onReject }: Props) => {
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white shadow-lg rounded-2xl p-6 w-96">
        <h2 className="text-center text-xl font-bold">New Shipment Available</h2>
        <div className="flex justify-evenly mt-6">
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentRequest;
