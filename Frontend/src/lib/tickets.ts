import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lightweight client helper with safe fallback to localStorage when Supabase isn't configured
let supabase: SupabaseClient | null = null;
try {
  const w = window as any;
  const url = w.__SUPABASE_URL__ || w.SUPABASE_URL;
  const key = w.__SUPABASE_ANON_KEY__ || w.SUPABASE_ANON_KEY;
  if (url && key) {
    supabase = createClient(url, key);
    // eslint-disable-next-line no-console
    console.info("Supabase client initialized.");
  } else {
    // eslint-disable-next-line no-console
    console.warn("Supabase credentials not detected. Falling back to localStorage.");
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("Supabase init failed, using localStorage fallback.");
}

export type TicketRecord = {
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
  status: "Confirmed" | "Waiting" | "Cancelled";
  created_at?: string;
  coach?: string;
  priority?: boolean;
};

const LS_KEY = "bookedTickets";

function readLS(): TicketRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as TicketRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLS(tickets: TicketRecord[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(tickets));
  } catch {}
}

export const ticketsApi = {
  async add(ticket: TicketRecord) {
    if (supabase) {
      await supabase.from("tickets").insert(ticket);
    }
    const current = readLS();
    writeLS([ticket, ...current]);
  },
  async list(): Promise<TicketRecord[]> {
    if (supabase) {
      const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        // Also mirror to localStorage for offline view
        writeLS(data as TicketRecord[]);
        return data as TicketRecord[];
      }
    }
    return readLS();
  },
  async clearAllLocal() {
    writeLS([]);
  }
};
