// Lightweight train search using simulation JSON datasets
// Notes:
// - Stations use codes like NDLS, HWH, MAS, etc.
// - Input origin/destination are matched by station code (case-insensitive).
// - Price is estimated from cumulative distance and train category.

// Import JSON directly (Vite supports JSON imports)
// Paths: from src/lib -> ../../simulation/*.json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import trains from "../../simulation/trains_100.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schedules from "../../simulation/schedules_100.json";

export type SimTrain = {
  train_no: string;
  train_name: string;
  category: string;
  from_station: string;
  to_station: string;
  avg_speed_kmph?: number;
};

export type SimStop = {
  train_no: string;
  train_name: string;
  station_id: string;
  arrival: string; // "HH:MM" or ""
  departure: string; // "HH:MM" or ""
  halt_min: number;
  seq: number;
  day_offset: number; // relative day offset from start
  category: string;
  cum_distance_km?: number;
};

export type SimSearchResult = {
  trainNumber: string;
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  category: string;
  from: string;
  to: string;
};

// Build stops per train number
const stopsByTrain: Map<string, SimStop[]> = new Map();
(schedules as SimStop[]).forEach((row) => {
  const arr = stopsByTrain.get(row.train_no) || [];
  arr.push(row);
  stopsByTrain.set(row.train_no, arr);
});
// Sort each train's stops by (day_offset, seq)
stopsByTrain.forEach((arr, key) => {
  arr.sort((a, b) => (a.day_offset - b.day_offset) || (a.seq - b.seq));
  stopsByTrain.set(key, arr);
});

export function getAllTrains(): SimTrain[] {
  return trains as SimTrain[];
}

export function getTrainSchedule(trainNo: string): SimStop[] | undefined {
  return stopsByTrain.get(trainNo);
}

// Unique station codes present in schedules
let _allStationsCache: string[] | null = null;
export function getAllStations(): string[] {
  if (_allStationsCache) return _allStationsCache;
  const set = new Set<string>();
  (schedules as SimStop[]).forEach((s) => {
    if (s.station_id) set.add(s.station_id.toUpperCase());
  });
  _allStationsCache = Array.from(set).sort();
  return _allStationsCache;
}

// Station code -> full name (subset from simulation sources)
const STATIONS_NAME_MAP: Record<string, string> = {
  TVC: 'Thiruvananthapuram Central',
  ERS: 'Ernakulam Junction',
  CBE: 'Coimbatore Junction',
  MAS: 'Chennai Central',
  BZA: 'Vijayawada Junction',
  SC: 'Secunderabad Junction',
  KCG: 'Hyderabad Deccan',
  SBC: 'Bangalore City',
  UBL: 'Hubballi Junction',
  PUNE: 'Pune Junction',
  BCT: 'Mumbai Central',
  NGP: 'Nagpur Junction',
  BPL: 'Bhopal Junction',
  JBP: 'Jabalpur Junction',
  RAIPUR: 'Raipur Junction',
  HWH: 'Howrah Junction',
  KOAA: 'Kolkata',
  PNBE: 'Patna Junction',
  GKP: 'Gorakhpur Junction',
  LKO: 'Lucknow Junction',
  CNB: 'Kanpur Central',
  NDLS: 'New Delhi',
  JP: 'Jaipur Junction',
  ADI: 'Ahmedabad Junction',
  CDG: 'Chandigarh'
};

export function getAllStationsWithNames(): { code: string; name: string }[] {
  const codes = getAllStations();
  return codes.map((c) => ({ code: c, name: STATIONS_NAME_MAP[c] || c }));
}

function timeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return (h || 0) * 60 + (m || 0);
}

function minutesToDuration(mins: number): string {
  const d = Math.max(0, Math.round(mins));
  const h = Math.floor(d / 60);
  const m = d % 60;
  return `${h}h ${m}m`;
}

function estimatePriceKm(km: number, category: string): number {
  const basePerKm = 0.7; // base INR per km
  const multiplier = category.includes("Rajdhani")
    ? 2.0
    : category.includes("Shatabdi")
    ? 1.8
    : category.includes("Vande Bharat")
    ? 2.2
    : category.includes("Tejas")
    ? 1.9
    : category.includes("Superfast")
    ? 1.4
    : 1.0;
  return Math.max(50, km * basePerKm * multiplier);
}

export function findTrains(originInput: string, destinationInput: string, date: string): SimSearchResult[] {
  const origin = (originInput || "").trim().toUpperCase();
  const destination = (destinationInput || "").trim().toUpperCase();
  if (!origin || !destination) return [];

  const results: SimSearchResult[] = [];
  (trains as SimTrain[]).forEach((t) => {
    const stops = stopsByTrain.get(t.train_no);
    if (!stops || stops.length < 2) return;

    // find first occurrence of origin, then a later occurrence of destination
    const fromIdx = stops.findIndex((s) => s.station_id === origin);
    if (fromIdx === -1) return;
    const toIdx = stops.findIndex((s, i) => i > fromIdx && s.station_id === destination);
    if (toIdx === -1) return;

    const dep = stops[fromIdx].departure || stops[fromIdx].arrival || "";
    const arr = stops[toIdx].arrival || stops[toIdx].departure || "";
    // compute duration considering day_offset
    const depAbs = stops[fromIdx].day_offset * 24 * 60 + timeToMinutes(dep);
    const arrAbs = stops[toIdx].day_offset * 24 * 60 + timeToMinutes(arr);
    const durMin = Math.max(0, arrAbs - depAbs);

    // distance if available
    const fromKm = stops[fromIdx].cum_distance_km || 0;
    const toKm = stops[toIdx].cum_distance_km || fromKm;
    const distKm = Math.max(0, toKm - fromKm);
    const price = estimatePriceKm(distKm || 300, t.category || "");

    results.push({
      trainNumber: t.train_no,
      trainName: t.train_name,
      departureTime: dep,
      arrivalTime: arr,
      duration: minutesToDuration(durMin),
      price,
      category: t.category,
      from: origin,
      to: destination,
    });
  });

  // Sort by departure time
  results.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
  return results.slice(0, 20);
}
