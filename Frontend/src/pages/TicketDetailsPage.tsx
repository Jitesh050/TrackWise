import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// This would be replaced by a real data fetch in a real app
const mockTickets: Record<string, any> = {
  DEMO1234: {
    pnr: "DEMO1234",
    passengerName: "John Doe",
    trainNumber: "12345",
    trainName: "Express Line",
    from: "Station A",
    to: "Station B",
    date: "2025-08-16",
    departureTime: "10:00",
    arrivalTime: "14:00",
    seatNumbers: ["A1", "A2"],
    class: "AC",
    fare: 1500,
    status: "Confirmed"
  }
};

const TicketDetailsPage = () => {
  const { pnr } = useParams<{ pnr: string }>();
  const ticket = mockTickets[pnr || ""];

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-900">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-gray-600">No ticket found for the provided PNR.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full border-gray-200 shadow-sm">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <h3 className="text-xl font-semibold">Ticket Details</h3>
          <p className="text-sm opacity-90">PNR: {ticket.pnr}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Passenger Name:</span>
            <span className="text-gray-900">{ticket.passengerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Train:</span>
            <span className="text-gray-900">{ticket.trainNumber} - {ticket.trainName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">From:</span>
            <span className="text-gray-900">{ticket.from}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">To:</span>
            <span className="text-gray-900">{ticket.to}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Date:</span>
            <span className="text-gray-900">{ticket.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Departure:</span>
            <span className="text-gray-900">{ticket.departureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Arrival:</span>
            <span className="text-gray-900">{ticket.arrivalTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Seat Numbers:</span>
            <span className="text-gray-900">{ticket.seatNumbers.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Class:</span>
            <span className="text-gray-900">{ticket.class}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Fare:</span>
            <span className="text-gray-900">₹{ticket.fare}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="text-gray-900">{ticket.status}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetailsPage;
