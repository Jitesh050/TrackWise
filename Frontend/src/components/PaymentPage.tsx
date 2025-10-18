import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle } from "lucide-react";
// Using a direct path to the image
const qrCodeImage = "/src/assets/upi-qr.png";
import ETicket from "./ETicket";
import { Switch } from "@/components/ui/switch";
import { ticketsApi, type TicketRecord } from "@/lib/tickets";
import { priorityTicketsApi, type PriorityTicketRecord } from "@/lib/priority-tickets";

interface PaymentPageProps {
  selectedTrain: {
    trainNumber: string;
    trainName: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
  };
  bookingDetails: {
    origin: string;
    destination: string;
    date: string;
    passengers: string;
    trainClass: string;
    priorityTicket: boolean;
    passengerName: string;
    email: string;
    phone: string;
  };
  selectedSeats: string[];
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const PaymentPage = ({ selectedTrain, bookingDetails, selectedSeats, onBack, onPaymentSuccess }: PaymentPageProps) => {
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [priority, setPriority] = useState(false);
  const [priorityType, setPriorityType] = useState("");
  const [priorityDoc, setPriorityDoc] = useState<File | null>(null);
  const [docUploaded, setDocUploaded] = useState(false);

  const totalFare = selectedTrain.price * parseInt(bookingDetails.passengers);
  const serviceFee = 2.99;
  const totalAmount = totalFare + serviceFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // If priority ticket is selected and document is uploaded, save priority ticket application
    if (priority && priorityType && priorityDoc) {
      const priorityTicketData: PriorityTicketRecord = {
        pnr: `PNR${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        passengerName: bookingDetails.passengerName,
        trainNumber: selectedTrain.trainNumber,
        trainName: selectedTrain.trainName,
        from: bookingDetails.origin,
        to: bookingDetails.destination,
        date: bookingDetails.date,
        departureTime: selectedTrain.departureTime,
        arrivalTime: selectedTrain.arrivalTime,
        seatNumbers: selectedSeats,
        class: bookingDetails.trainClass,
        fare: totalAmount,
        priorityType: priorityType as "Student" | "Old-Age" | "Medical",
        documentUrl: URL.createObjectURL(priorityDoc), // In real app, upload to cloud storage
        documentName: priorityDoc.name,
        status: "Pending",
        email: bookingDetails.email,
        phone: bookingDetails.phone,
      };

      try {
        await priorityTicketsApi.add(priorityTicketData);
        console.log("Priority ticket application submitted successfully");
      } catch (error) {
        console.error("Error submitting priority ticket application:", error);
      }
    }
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTicketData: TicketRecord = {
      pnr: `PNR${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      passengerName: bookingDetails.passengerName,
      trainNumber: selectedTrain.trainNumber,
      trainName: selectedTrain.trainName,
      from: bookingDetails.origin,
      to: bookingDetails.destination,
      date: bookingDetails.date,
      departureTime: selectedTrain.departureTime,
      arrivalTime: selectedTrain.arrivalTime,
      seatNumbers: selectedSeats,
      class: bookingDetails.trainClass,
      fare: totalAmount,
      status: "Confirmed",
      coach: "C1",
    };

    try {
      await ticketsApi.add(newTicketData);
    } catch (e) {
      console.warn("Saving ticket failed, but proceeding to confirmation.", e);
    }

    setTicketData(newTicketData);
    setPaymentSuccess(true);
    setIsProcessing(false);
    onPaymentSuccess();
  };

  if (paymentSuccess && ticketData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Ticket Confirmed!</h2>
                          <p className="text-gray-600">Your booking has been successfully processed</p>
        </div>
        
        <ETicket ticketData={ticketData} />
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.print()}>Download Ticket</Button>
          <Button variant="outline" onClick={() => navigator.share && navigator.share({
            title: 'Train Ticket',
            text: `PNR: ${ticketData.pnr}`,
            url: window.location.href
          })}>
            Share Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{selectedTrain.trainNumber} - {selectedTrain.trainName}</p>
              <p className="text-sm text-gray-500">{bookingDetails.origin} → {bookingDetails.destination}</p>
              <p className="text-sm text-gray-500">{bookingDetails.date}</p>
            </div>
            <Badge variant="secondary">{bookingDetails.trainClass}</Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tickets ({bookingDetails.passengers}x)</span>
              <span>₹{totalFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>₹{serviceFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{(totalFare + serviceFee).toFixed(2)}</span>
            </div>
          </div>
          {/* Priority Option */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" checked={priority} onChange={e => {
                setPriority(e.target.checked);
                if (!e.target.checked) {
                  setPriorityType("");
                  setPriorityDoc(null);
                  setDocUploaded(false);
                }
              }} />
              Apply for Priority Ticket
            </label>
            {priority && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block mb-1 font-medium">Select Priority Type</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={priorityType}
                    onChange={e => {
                      setPriorityType(e.target.value);
                      setPriorityDoc(null);
                      setDocUploaded(false);
                    }}
                  >
                    <option value="">-- Select --</option>
                    <option value="Student">Student</option>
                    <option value="Old-Age">Old-Age</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
                {priorityType && (
                  <div>
                    <label className="block mb-1 font-medium">Upload Document</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setPriorityDoc(e.target.files[0]);
                          setDocUploaded(true); // Mock upload
                        }
                      }}
                    />
                    {docUploaded && priorityDoc && (
                      <div className="mt-2 text-green-700 text-sm">Document uploaded: {priorityDoc.name} (sent to admin)</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>UPI Payment</CardTitle>
          <CardDescription>Scan the QR code with any UPI app to pay</CardDescription>
        </CardHeader>
        <CardContent>
          {!showQR ? (
            <div className="flex flex-col items-center gap-6">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowQR(true)}>
                Show UPI QR Code
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <img src={qrCodeImage} alt="UPI QR Code" className="w-64 h-64 rounded-lg border bg-white p-2" />
              <Button onClick={handlePayment} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                {isProcessing ? "Processing..." : `I've Paid, Confirm Payment`}
              </Button>
            </div>
          )}
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secured with 256-bit SSL encryption</span>
          </div>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
