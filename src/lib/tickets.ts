import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';

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
// eslint-disable-next-line no-empty
  } catch {}
}

export const ticketsApi = {
  async add(ticket: TicketRecord) {
    try {
      const uid = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email || null;
      await addDoc(collection(db, 'tickets'), {
        ...ticket,
        userId: uid || null,
        userEmail,
        created_at: serverTimestamp(),
      });
    } catch {
      const current = readLS();
      writeLS([ticket, ...current]);
    }
  },
  async list(params?: { uid?: string | null; userEmail?: string | null }): Promise<TicketRecord[]> {
    try {
      const uid = params?.uid ?? auth.currentUser?.uid ?? null;
      const userEmail = params?.userEmail ?? auth.currentUser?.email ?? null;
      let isAdmin = false;
      if (uid) {
        const adminSnap = await getDoc(doc(db, 'admins', uid));
        isAdmin = adminSnap.exists();
      }

      const base = collection(db, 'tickets');
      let docs: TicketRecord[] = [];
      if (isAdmin) {
        const qAll = query(base, orderBy('created_at', 'desc'));
        const snapAll = await getDocs(qAll);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        docs = snapAll.docs.map(d => ({ id: d.id, ...(d.data() as any) } as TicketRecord));
      } else {
        // No orderBy to avoid composite index requirement; we'll sort client-side
        const byUser = query(base, where('userId', '==', uid || ''));
        const snapUser = await getDocs(byUser);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a = snapUser.docs.map(d => ({ id: d.id, ...(d.data() as any) } as TicketRecord));
        let b: TicketRecord[] = [];
        if (userEmail) {
          // Fallback: include tickets saved without userId but with matching email
          const byEmail = query(base, where('userEmail', '==', userEmail));
          const snapEmail = await getDocs(byEmail);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          b = snapEmail.docs.map(d => ({ id: d.id, ...(d.data() as any) } as TicketRecord));
        }
        const seen = new Set(a.map(x => x.id));
        docs = [...a, ...b.filter(x => x.id && !seen.has(x.id))];
      }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: TicketRecord[] = docs.map((rec: any) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = rec as any;
        return {
          id: rec.id,
          ...data,
          created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
        } as TicketRecord;
      });
      // Ensure order desc by created_at if some records missed serverTimestamp at write time
      items.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
      writeLS(items);
      return items;
    } catch {
      return readLS();
    }
  },
  async clearAllLocal() {
    writeLS([]);
  }
};
