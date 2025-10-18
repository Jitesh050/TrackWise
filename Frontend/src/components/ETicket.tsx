import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, QrCode, Train, MapPin, Calendar, Clock, User } from "lucide-react";

interface ETicketProps {
  ticketData: {
    pnr: string;
    passengerName: string;
    trainNumber: string;
    trainName: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    seatNumbers: string[];
    class: string;
    fare: number;
    status: string;
  };
}

const ETicket = ({ ticketData }: ETicketProps) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    // For demo purposes, we'll create a placeholder
    // QR code will encode all ticket details as formatted plain text
    const details = `PNR: ${ticketData.pnr}\nPassenger: ${ticketData.passengerName}\nTrain: ${ticketData.trainNumber} - ${ticketData.trainName}\nFrom: ${ticketData.from}\nTo: ${ticketData.to}\nDate: ${ticketData.date}\nDeparture: ${ticketData.departureTime}\nArrival: ${ticketData.arrivalTime}\nSeat Numbers: ${ticketData.seatNumbers.join(', ')}\nClass: ${ticketData.class}\nFare: ₹${ticketData.fare}\nStatus: ${ticketData.status}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(details)}`;
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eticket_${ticketData.pnr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Train size={24} />
          <span className="text-lg font-bold">TrackWise Rail</span>
        </div>
        <h3 className="text-xl font-semibold">E-Ticket</h3>
        <p className="text-sm opacity-90">PNR: {ticketData.pnr}</p>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Passenger Info */}
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-600" />
          <span className="font-medium">{ticketData.passengerName}</span>
        </div>

        <Separator />

        {/* Train Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-600">{ticketData.trainNumber}</p>
              <p className="text-sm text-gray-600">{ticketData.trainName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{ticketData.class}</p>
              <p className="text-xs text-gray-500">Class</p>
            </div>
          </div>

          {/* Journey Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-600" />
              <div>
                <p className="font-medium">{ticketData.from}</p>
                <p className="text-xs text-gray-500">Origin</p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-12 border-t border-dashed border-gray-400"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium">{ticketData.to}</p>
                <p className="text-xs text-gray-500">Destination</p>
              </div>
              <MapPin size={16} className="text-gray-600" />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-600" />
              <div>
                <p className="font-medium">{ticketData.date}</p>
                <p className="text-xs text-gray-500">Journey Date</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-600" />
              <div>
                <p className="font-medium">{ticketData.departureTime}</p>
                <p className="text-xs text-gray-500">Departure</p>
              </div>
            </div>
          </div>

          {/* Seat Info */}
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Seat Numbers</p>
                <p className="text-lg font-bold text-blue-600">
                  {ticketData.seatNumbers.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Fare</p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{ticketData.fare.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* QR Code */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {ticketData.status}
            </span>
          </div>
          <div className="text-center">
            <img 
              src={generateQRCode()} 
              alt="QR Code" 
              className="w-20 h-20 mx-auto mb-2 cursor-pointer transition-transform hover:scale-105"
              onClick={() => setShowQrModal(true)}
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <QrCode size={12} />
              Scan at station
            </p>
            {showQrModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowQrModal(false)}>
                <div className="bg-white rounded-lg p-4 shadow-lg" onClick={e => e.stopPropagation()}>
                  <img 
                    src={generateQRCode().replace('size=100x100', 'size=300x300')} 
                    alt="QR Code Large" 
                    className="w-72 h-72 mx-auto mb-4" 
                  />
                  <button className="block mx-auto mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowQrModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          className="w-full"
        >
          <Download size={16} className="mr-2" />
          Download E-Ticket
        </Button>

        <p className="text-xs text-center text-gray-500">
          Please carry a valid photo ID along with this e-ticket during your journey.
        </p>
      </CardContent>
    </Card>
  );
};

export default ETicket;