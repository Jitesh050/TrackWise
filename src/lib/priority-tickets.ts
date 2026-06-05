import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';

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
  } catch (error) { console.error(error); }
}

export const priorityTicketsApi = {
  async uploadDocument(file: File): Promise<{ fileUrl: string; fileName: string }> {
    // Persist as data URL so it survives sessions and can be opened by admins
    const toDataURL = (f: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
    const dataUrl = await toDataURL(file);
    return {
      fileUrl: dataUrl,
      fileName: file.name,
    };
  },

  async add(ticket: PriorityTicketRecord) {
    try {
      const uid = auth.currentUser?.uid;
      await addDoc(collection(db, 'priority_tickets'), {
        ...ticket,
        status: ticket.status || 'Pending',
        userId: uid || null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return ticket;
    } catch (error) {
      const current = readLS();
      writeLS([ticket, ...current]);
      return ticket;
    }
  },
  
  async list(): Promise<PriorityTicketRecord[]> {
    try {
      const uid = auth.currentUser?.uid;
      let isAdmin = false;
      if (uid) {
        const adminSnap = await getDoc(doc(db, 'admins', uid));
        isAdmin = adminSnap.exists();
      }

      const base = collection(db, 'priority_tickets');
      const q = isAdmin
        ? query(base, orderBy('created_at', 'desc'))
        : query(base, where('userId', '==', uid || ''), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      const items: PriorityTicketRecord[] = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          ...data,
          created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
          updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at,
        } as PriorityTicketRecord;
      });
      writeLS(items);
      return items;
    } catch (error) {
      return readLS();
    }
  },
  
  async updateStatus(id: string, status: "Approved" | "Rejected", adminNotes?: string) {
    try {
      if (!id) throw new Error('Missing ticket id');
      const ref = doc(db, 'priority_tickets', id);
      await updateDoc(ref, {
        status,
        adminNotes: adminNotes || '',
        updated_at: serverTimestamp(),
      });

      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, status, adminNotes, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
    } catch (error) {
      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, status, adminNotes, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
    }
  },
  
  async updateDocument(id: string, fileUrl: string, fileName: string) {
    try {
      if (!id) throw new Error('Missing ticket id');
      const ref = doc(db, 'priority_tickets', id);
      await updateDoc(ref, {
        documentUrl: fileUrl,
        documentName: fileName,
        updated_at: serverTimestamp(),
      });
      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, documentUrl: fileUrl, documentName: fileName, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
    } catch (error) {
      const current = readLS();
      const updated = current.map(ticket => 
        ticket.id === id 
          ? { ...ticket, documentUrl: fileUrl, documentName: fileName, updated_at: new Date().toISOString() }
          : ticket
      );
      writeLS(updated);
    }
  },
  
  async getByStatus(status: "Pending" | "Approved" | "Rejected"): Promise<PriorityTicketRecord[]> {
    const allTickets = await this.list();
    return allTickets.filter(ticket => ticket.status === status);
  },
  
  async getByPriorityType(priorityType: "Student" | "Old-Age" | "Medical"): Promise<PriorityTicketRecord[]> {
    const allTickets = await this.list();
    return allTickets.filter(ticket => ticket.priorityType === priorityType);
  },

  async getStats() {
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
