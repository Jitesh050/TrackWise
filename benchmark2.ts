const tickets = Array.from({ length: 10000 }, (_, i) => ({
  passengerName: `Passenger ${i}`,
  pnr: `PNR${i}`,
  trainNumber: `TRN${i}`,
  status: i % 3 === 0 ? "Confirmed" : i % 3 === 1 ? "Waiting" : "Cancelled",
}));
const searchTerm = "Passenger 5";
const filterStatus = "all";

const start = performance.now();
for(let i = 0; i < 100; i++) {
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.trainNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const confirmed = tickets.filter(t => t.status === "Confirmed").length;
  const waiting = tickets.filter(t => t.status === "Waiting").length;
  const cancelled = tickets.filter(t => t.status === "Cancelled").length;
}
console.log("Original:", performance.now() - start);

const start2 = performance.now();
for(let i = 0; i < 100; i++) {
  const term = searchTerm.toLowerCase();
  const result = { filtered: [], confirmed: 0, waiting: 0, cancelled: 0 };
  for (let j = 0; j < tickets.length; j++) {
    const ticket = tickets[j];
    if (ticket.status === "Confirmed") result.confirmed++;
    else if (ticket.status === "Waiting") result.waiting++;
    else if (ticket.status === "Cancelled") result.cancelled++;

    const matchesSearch = !term ||
                         ticket.passengerName.toLowerCase().includes(term) ||
                         ticket.pnr.toLowerCase().includes(term) ||
                         ticket.trainNumber.toLowerCase().includes(term);
    const matchesFilter = filterStatus === "all" || ticket.status === filterStatus;

    if (matchesSearch && matchesFilter) {
      result.filtered.push(ticket);
    }
  }
}
console.log("Optimized:", performance.now() - start2);
