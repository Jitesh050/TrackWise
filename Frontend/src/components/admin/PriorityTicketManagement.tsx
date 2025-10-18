import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download,
  Filter,
  Search
} from "lucide-react";
import { priorityTicketsApi, type PriorityTicketRecord } from "@/lib/priority-tickets";

const PriorityTicketManagement = () => {
  const [priorityTickets, setPriorityTickets] = useState<PriorityTicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<PriorityTicketRecord | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Student" | "Old-Age" | "Medical">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPriorityTickets();
  }, []);

  const loadPriorityTickets = async () => {
    setLoading(true);
    try {
      const tickets = await priorityTicketsApi.list();
      setPriorityTickets(tickets);
    } catch (error) {
      console.error("Error loading priority tickets:", error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (ticketId: string, status: "Approved" | "Rejected") => {
    try {
      await priorityTicketsApi.updateStatus(ticketId, status, adminNotes);
      setAdminNotes("");
      setSelectedTicket(null);
      await loadPriorityTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityTypeBadge = (type: string) => {
    switch (type) {
      case "Student":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Student</Badge>;
      case "Old-Age":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Old-Age</Badge>;
      case "Medical":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Medical</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredTickets = priorityTickets.filter(ticket => {
    const matchesFilter = filterType === "all" || ticket.priorityType === filterType;
    const matchesSearch = ticket.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.trainNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingTickets = priorityTickets.filter(t => t.status === "Pending");
  const approvedTickets = priorityTickets.filter(t => t.status === "Approved");
  const rejectedTickets = priorityTickets.filter(t => t.status === "Rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading priority tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{priorityTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, PNR, or train number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="Student">Student</option>
                <option value="Old-Age">Old-Age</option>
                <option value="Medical">Medical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Ticket Applications</CardTitle>
          <CardDescription>
            Review and manage priority ticket applications. Click on any application to view details and take action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No priority ticket applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{ticket.passengerName}</h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityTypeBadge(ticket.priorityType)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">PNR:</span> {ticket.pnr}
                        </div>
                        <div>
                          <span className="font-medium">Train:</span> {ticket.trainNumber}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {ticket.date}
                        </div>
                        <div>
                          <span className="font-medium">Route:</span> {ticket.from} → {ticket.to}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(ticket.documentUrl, '_blank');
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View Doc
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Priority Ticket Details</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passenger Name</label>
                  <p className="text-gray-900">{selectedTicket.passengerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PNR</label>
                  <p className="text-gray-900">{selectedTicket.pnr}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority Type</label>
                  <div className="mt-1">{getPriorityTypeBadge(selectedTicket.priorityType)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Train</label>
                  <p className="text-gray-900">{selectedTicket.trainNumber} - {selectedTicket.trainName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-gray-900">{selectedTicket.date} at {selectedTicket.departureTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Route</label>
                  <p className="text-gray-900">{selectedTicket.from} → {selectedTicket.to}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="text-gray-900">{selectedTicket.email}<br/>{selectedTicket.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Document</label>
                <div className="mt-1 flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{selectedTicket.documentName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedTicket.documentUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              {selectedTicket.status === "Pending" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full"
                    rows={3}
                  />
                </div>
              )}
              
              {selectedTicket.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedTicket.adminNotes}</p>
                </div>
              )}
              
              {selectedTicket.status === "Pending" && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleStatusUpdate(selectedTicket.id!, "Approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedTicket.id!, "Rejected")}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTicket(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityTicketManagement;
