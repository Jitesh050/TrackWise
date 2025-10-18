import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lightweight client helper with safe fallback to localStorage when Supabase isn't configured
let supabase: SupabaseClient | null = null;
try {
  const w = window as any;
  const url = w.__SUPABASE_URL__ || w.SUPABASE_URL;
  const key = w.__SUPABASE_ANON_KEY__ || w.SUPABASE_ANON_KEY;
  if (url && key) {
    supabase = createClient(url, key);
    console.info("Supabase client initialized for priority tickets.");
  } else {
    console.warn("Supabase credentials not detected. Falling back to localStorage for priority tickets.");
  }
} catch (e) {
  console.warn("Supabase init failed for priority tickets, using localStorage fallback.");
}

export type PriorityTicketRecord = {
  id?: string;
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
  priorityType: "Student" | "Old-Age" | "Medical";
  documentUrl: string;
  documentName: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNotes?: string;
  created_at?: string;
  updated_at?: string;
  email: string;
  phone: string;
};

const LS_KEY = "priorityTickets";
const API_BASE_URL = "http://localhost:3001/api";

function readLS(): PriorityTicketRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PriorityTicketRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLS(tickets: PriorityTicketRecord[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(tickets));
  } catch {}
}

export const priorityTicketsApi = {
  async uploadDocument(file: File): Promise<{ fileUrl: string; fileName: string }> {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${API_BASE_URL}/priority-tickets/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      return {
        fileUrl: result.fileUrl,
        fileName: result.fileName
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      // Fallback to local URL for development
      return {
        fileUrl: URL.createObjectURL(file),
        fileName: file.name
      };
    }
  },

  async add(ticket: PriorityTicketRecord) {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });

      if (!response.ok) {
        throw new Error('Failed to create priority ticket');
      }

      const result = await response.json();
      
      if (supabase) {
        await supabase.from("priority_tickets").insert(result.ticket);
      }
      
      const current = readLS();
      writeLS([result.ticket, ...current]);
      
      return result.ticket;
    } catch (error) {
      console.error('Error adding priority ticket:', error);
      
      // Fallback to localStorage only
      if (supabase) {
        await supabase.from("priority_tickets").insert(ticket);
      }
      const current = readLS();
      writeLS([ticket, ...current]);
    }
  },
  
  async list(): Promise<PriorityTicketRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets`);
      
      if (response.ok) {
        const result = await response.json();
        writeLS(result.tickets);
        return result.tickets;
      }
    } catch (error) {
      console.error('Error fetching priority tickets from API:', error);
    }

    // Fallback to Supabase/localStorage
    if (supabase) {
      const { data, error } = await supabase
        .from("priority_tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        writeLS(data as PriorityTicketRecord[]);
        return data as PriorityTicketRecord[];
      }
    }
    return readLS();
  },
  
  async updateStatus(id: string, status: "Approved" | "Rejected", adminNotes?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      const result = await response.json();
      
      if (supabase) {
        await supabase
          .from("priority_tickets")
          .update({ 
            status, 
            adminNotes, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", id);
      }
      
      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, status, adminNotes, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
      
      return result.ticket;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      
      // Fallback to Supabase/localStorage
      if (supabase) {
        await supabase
          .from("priority_tickets")
          .update({ 
            status, 
            adminNotes, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", id);
      }
      
      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, status, adminNotes, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
    }
  },
  
  async getByStatus(status: "Pending" | "Approved" | "Rejected"): Promise<PriorityTicketRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets?status=${status}`);
      
      if (response.ok) {
        const result = await response.json();
        return result.tickets;
      }
    } catch (error) {
      console.error('Error fetching tickets by status:', error);
    }

    const allTickets = await this.list();
    return allTickets.filter(ticket => ticket.status === status);
  },
  
  async getByPriorityType(priorityType: "Student" | "Old-Age" | "Medical"): Promise<PriorityTicketRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets?priorityType=${priorityType}`);
      
      if (response.ok) {
        const result = await response.json();
        return result.tickets;
      }
    } catch (error) {
      console.error('Error fetching tickets by priority type:', error);
    }

    const allTickets = await this.list();
    return allTickets.filter(ticket => ticket.priorityType === priorityType);
  },

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-tickets/stats`);
      
      if (response.ok) {
        const result = await response.json();
        return result.stats;
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }

    const allTickets = await this.list();
    return {
      total: allTickets.length,
      pending: allTickets.filter(t => t.status === 'Pending').length,
      approved: allTickets.filter(t => t.status === 'Approved').length,
      rejected: allTickets.filter(t => t.status === 'Rejected').length,
      byType: {
        Student: allTickets.filter(t => t.priorityType === 'Student').length,
        'Old-Age': allTickets.filter(t => t.priorityType === 'Old-Age').length,
        Medical: allTickets.filter(t => t.priorityType === 'Medical').length
      }
    };
  },
  
  async clearAllLocal() {
    writeLS([]);
  }
};
