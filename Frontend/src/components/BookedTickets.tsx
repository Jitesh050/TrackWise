import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Train, MapPin, Calendar, Clock, User, Download } from "lucide-react";

interface TicketData {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seatNumbers: string[];
  class: string;
  status: "Confirmed" | "Waiting" | "Cancelled";
  passengerName: string;
}

const BookedTickets = () => {
  // Mock data - in real app, this would come from API/database
  const bookedTickets: TicketData[] = [
    {
      pnr: "PNR2A3B4C5D",
      trainNumber: "EXP101",
      trainName: "Ocean Express",
      from: "Central Station",
      to: "Metro Junction",
      date: "2024-07-15",
      departureTime: "08:30",
      arrivalTime: "12:45",
      seatNumbers: ["A15", "A16"],
      class: "Business",
      status: "Confirmed",
      passengerName: "John Traveler"
    },
    {
      pnr: "PNR3C4D5E6F",
      trainNumber: "SPD330",
      trainName: "Capital Bullet",
      from: "North Terminal",
      to: "South Bay",
      date: "2024-07-20",
      departureTime: "14:15",
      arrivalTime: "17:30",
      seatNumbers: ["B22"],
      class: "Economy",
      status: "Waiting",
      passengerName: "John Traveler"
    },
    {
      pnr: "PNR4D5E6F7G",
      trainNumber: "REG205",
      trainName: "Valley Commuter",
      from: "East Park",
      to: "West Harbor",
      date: "2024-07-12",
      departureTime: "11:45",
      arrivalTime: "15:15",
      seatNumbers: ["C8"],
      class: "First Class",
      status: "Cancelled",
      passengerName: "John Traveler"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Waiting":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Booked Tickets</h2>
        <p className="text-gray-600">Manage and view all your train bookings</p>
      </div>

      {bookedTickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Train className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600 mb-4">No booked tickets found</p>
            <Button>Book Your First Ticket</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookedTickets.map((ticket) => (
            <Card key={ticket.pnr} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Train size={20} className="text-blue-600" />
                      {ticket.trainNumber} - {ticket.trainName}
                    </CardTitle>
                    <CardDescription>PNR: {ticket.pnr}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Journey Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-600" />
                    <div>
                      <p className="font-medium">{ticket.from}</p>
                      <p className="text-xs text-gray-500">Origin</p>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-12 border-t border-dashed border-gray-400"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">{ticket.to}</p>
                      <p className="text-xs text-gray-500">Destination</p>
                    </div>
                    <MapPin size={16} className="text-gray-600" />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-600" />
                    <div>
                      <p className="font-medium">{ticket.date}</p>
                      <p className="text-xs text-gray-500">Journey Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-600" />
                    <div>
                      <p className="font-medium">{ticket.departureTime}</p>
                      <p className="text-xs text-gray-500">Departure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-600" />
                    <div>
                      <p className="font-medium">{ticket.arrivalTime}</p>
                      <p className="text-xs text-gray-500">Arrival</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Passenger and Seat Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-600" />
                      <span className="font-medium">{ticket.passengerName}</span>
                    </div>
                    <Badge variant="outline">{ticket.class}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Seats: {ticket.seatNumbers.join(", ")}</p>
                  </div>
                </div>

                {/* Actions */}
                {ticket.status === "Confirmed" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Download size={14} />
                      Download Ticket
                    </Button>
                    <Button size="sm" variant="outline">
                      Cancel Booking
                    </Button>
                  </div>
                )}

                {ticket.status === "Waiting" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      Check Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Cancel Booking
                    </Button>
                  </div>
                )}

                {ticket.status === "Cancelled" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      View Refund Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedTickets;