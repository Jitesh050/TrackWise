import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeatProps {
  seatNumber: string;
  isAvailable: boolean;
  isSelected: boolean;
  isReserved?: boolean;
  onSelect: (seatNumber: string) => void;
}

const Seat = ({ seatNumber, isAvailable, isSelected, isReserved, onSelect }: SeatProps) => {
  const getSeatStyles = () => {
    if (isReserved) return "bg-red-100 border-red-300 cursor-not-allowed";
    if (isSelected) return "bg-blue-600 border-blue-600 text-white";
    if (isAvailable) return "bg-white border-gray-300 hover:border-blue-600 cursor-pointer";
    return "bg-gray-100 border-gray-300 cursor-not-allowed";
  };

  return (
    <button
      className={`w-8 h-8 border-2 rounded text-xs font-medium transition-all ${getSeatStyles()}`}
      onClick={() => isAvailable && !isReserved && onSelect(seatNumber)}
      disabled={!isAvailable || isReserved}
      title={`Seat ${seatNumber} - ${isReserved ? 'Reserved' : isAvailable ? 'Available' : 'Occupied'}`}
    >
      {seatNumber}
    </button>
  );
};

interface SeatSelectionProps {
  onSeatsSelected: (seats: string[]) => void;
  maxSeats?: number;
}

const SeatSelection = ({ onSeatsSelected, maxSeats = 4 }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seat layout (simplified coach layout)
  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let row = 1; row <= 20; row++) {
      for (let seat of rows) {
        const seatNumber = `${row}${seat}`;
        const isReserved = Math.random() < 0.3; // 30% chance reserved
        const isAvailable = !isReserved;
        seats.push({
          seatNumber,
          isAvailable,
          isReserved,
          isSelected: selectedSeats.includes(seatNumber)
        });
      }
    }
    return seats;
  };

  const seats = generateSeats();

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats(prev => {
      let newSelection;
      if (prev.includes(seatNumber)) {
        newSelection = prev.filter(s => s !== seatNumber);
      } else if (prev.length < maxSeats) {
        newSelection = [...prev, seatNumber];
      } else {
        return prev; // Max seats reached
      }
      onSeatsSelected(newSelection);
      return newSelection;
    });
  };

  const groupSeatsByRow = () => {
    const grouped: { [key: number]: typeof seats } = {};
    seats.forEach(seat => {
      const row = parseInt(seat.seatNumber);
      if (!grouped[row]) grouped[row] = [];
      grouped[row].push(seat);
    });
    return grouped;
  };

  const seatsByRow = groupSeatsByRow();

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Seat Selection
              <Badge variant="outline">
                {selectedSeats.length}/{maxSeats} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex gap-4 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                <span>Reserved</span>
              </div>
            </div>

            {/* Seat Map */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-6 text-xs font-medium text-gray-500">{row}</span>
                  <div className="flex gap-1">
                    {rowSeats.slice(0, 3).map(seat => (
                      <Seat
                        key={seat.seatNumber}
                        {...seat}
                        isSelected={selectedSeats.includes(seat.seatNumber)}
                        onSelect={handleSeatSelect}
                      />
                    ))}
                  </div>
                  <div className="w-8 flex justify-center">
                    <div className="w-4 border-b border-gray-300"></div>
                  </div>
                  <div className="flex gap-1">
                    {rowSeats.slice(3, 6).map(seat => (
                      <Seat
                        key={seat.seatNumber}
                        {...seat}
                        isSelected={selectedSeats.includes(seat.seatNumber)}
                        onSelect={handleSeatSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSeats.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-blue-900 border border-blue-200">
                <p className="text-sm font-medium">Selected Seats:</p>
                <p className="text-sm text-blue-700">
                  {selectedSeats.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Waiting List Box */}
      <div className="w-80 min-w-[18rem]">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span role="img" aria-label="hourglass">⏳</span> Waiting List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-gray-700">There are <span className="font-bold">7</span> users ahead of you in the waiting list.</div>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold mt-2">Book Waiting List Ticket</Button>
            <div className="mt-3 text-xs text-gray-500">If all seats are booked, you can join the waiting list. You'll be notified if a seat becomes available.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeatSelection;