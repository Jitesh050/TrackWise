import React, { useState, useEffect, useCallback, useRef } from 'react'

// --- Types ---
export interface TrainRecord {
  train_no: string
  train_name: string
  from_station: string
  to_station: string
  category: string
}

export interface ScheduleRecord {
  train_no: string
  station_id: string
  arrival: string // "" when not applicable
  departure: string // "" when not applicable
  halt_min: number
  seq: number
}

export interface StationRecord {
  id: string
  name: string
}

export interface TrainStatusItem {
  id: string
  name: string
  from: string
  to: string
  departure: string
  arrival: string
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Arrived'
  delay: number
  nextStation: string
  platform: number
  progress?: number
}

export interface UseTrainStatusReturn {
  trains: TrainStatusItem[]
  loading: boolean
  error: unknown
  updateTrainStatus: (
    trainId: string,
    status: TrainStatusItem['status'],
    delay: number,
    currentNextStation?: string
  ) => void
  resetSimulation: () => void
}

// --- EMBEDDED DATA FROM UPLOADED FILES (SIMULATING BACKEND DATA SOURCE) ---
const TRAINS_DATA: TrainRecord[] = [
  { train_no: '12000', train_name: 'Rajdhani NDLS-HWH', from_station: 'NDLS', to_station: 'HWH', category: 'Rajdhani' },
  { train_no: '12010', train_name: 'Duronto HWH-SBC', from_station: 'HWH', to_station: 'SBC', category: 'Duronto' },
  { train_no: '12025', train_name: 'Tejas SC-KCG', from_station: 'SC', to_station: 'KCG', category: 'Tejas' },
  { train_no: '12044', train_name: 'Vande Bharat PNBE-BCT', from_station: 'PNBE', to_station: 'BCT', category: 'Vande Bharat' },
  { train_no: '12053', train_name: 'Tejas RAIPUR-MAS', from_station: 'RAIPUR', to_station: 'MAS', category: 'Tejas' },
  { train_no: '12061', train_name: 'Superfast Express KCG-LKO', from_station: 'KCG', to_station: 'LKO', category: 'Superfast Express' },
  { train_no: '12071', train_name: 'Shatabdi KOAA-ERS', from_station: 'KOAA', to_station: 'ERS', category: 'Shatabdi' },
]

const SCHEDULES_DATA: ScheduleRecord[] = [
  { train_no: '12000', station_id: 'NDLS', arrival: '', departure: '08:15', halt_min: 0, seq: 1 },
  { train_no: '12000', station_id: 'CNB', arrival: '13:00', departure: '13:05', halt_min: 5, seq: 2 },
  { train_no: '12000', station_id: 'PNBE', arrival: '18:00', departure: '18:05', halt_min: 5, seq: 3 },
  { train_no: '12000', station_id: 'HWH', arrival: '21:45', departure: '', halt_min: 0, seq: 4 },
  { train_no: '12010', station_id: 'HWH', arrival: '', departure: '09:00', halt_min: 0, seq: 1 },
  { train_no: '12010', station_id: 'MAS', arrival: '15:30', departure: '15:35', halt_min: 5, seq: 2 },
  { train_no: '12010', station_id: 'SBC', arrival: '19:45', departure: '', halt_min: 0, seq: 3 },
  { train_no: '12025', station_id: 'SC', arrival: '', departure: '10:30', halt_min: 0, seq: 1 },
  { train_no: '12025', station_id: 'BZA', arrival: '13:30', departure: '13:35', halt_min: 5, seq: 2 },
  { train_no: '12025', station_id: 'MAS', arrival: '16:50', departure: '16:55', halt_min: 5, seq: 3 },
  { train_no: '12025', station_id: 'KCG', arrival: '22:00', departure: '', halt_min: 0, seq: 4 },
  { train_no: '12044', station_id: 'PNBE', arrival: '', departure: '11:00', halt_min: 0, seq: 1 },
  { train_no: '12044', station_id: 'NGP', arrival: '15:45', departure: '15:50', halt_min: 5, seq: 2 },
  { train_no: '12044', station_id: 'PUNE', arrival: '21:00', departure: '21:05', halt_min: 5, seq: 3 },
  { train_no: '12044', station_id: 'BCT', arrival: '01:30', departure: '', halt_min: 0, seq: 4 },
  { train_no: '12053', station_id: 'RAIPUR', arrival: '', departure: '12:00', halt_min: 0, seq: 1 },
  { train_no: '12053', station_id: 'BZA', arrival: '17:15', departure: '17:20', halt_min: 5, seq: 2 },
  { train_no: '12053', station_id: 'MAS', arrival: '21:40', departure: '', halt_min: 0, seq: 3 },
  { train_no: '12061', station_id: 'KCG', arrival: '', departure: '13:30', halt_min: 0, seq: 1 },
  { train_no: '12061', station_id: 'JBP', arrival: '18:50', departure: '18:55', halt_min: 5, seq: 2 },
  { train_no: '12061', station_id: 'LKO', arrival: '22:50', departure: '', halt_min: 0, seq: 3 },
  { train_no: '12071', station_id: 'KOAA', arrival: '', departure: '14:10', halt_min: 0, seq: 1 },
  { train_no: '12071', station_id: 'BZA', arrival: '20:45', departure: '20:50', halt_min: 5, seq: 2 },
  { train_no: '12071', station_id: 'ERS', arrival: '03:00', departure: '', halt_min: 0, seq: 3 },
]

const STATIONS_DATA: StationRecord[] = [
  { id: 'TVC', name: 'Thiruvananthapuram Central' },
  { id: 'ERS', name: 'Ernakulam Junction' },
  { id: 'CBE', name: 'Coimbatore Junction' },
  { id: 'MAS', name: 'Chennai Central' },
  { id: 'BZA', name: 'Vijayawada Junction' },
  { id: 'SC', name: 'Secunderabad Junction' },
  { id: 'KCG', name: 'Hyderabad Deccan' },
  { id: 'SBC', name: 'Bangalore City' },
  { id: 'UBL', name: 'Hubballi Junction' },
  { id: 'PUNE', name: 'Pune Junction' },
  { id: 'BCT', name: 'Mumbai Central' },
  { id: 'NGP', name: 'Nagpur Junction' },
  { id: 'BPL', name: 'Bhopal Junction' },
  { id: 'JBP', name: 'Jabalpur Junction' },
  { id: 'RAIPUR', name: 'Raipur Junction' },
  { id: 'HWH', name: 'Howrah Junction' },
  { id: 'KOAA', name: 'Kolkata' },
  { id: 'PNBE', name: 'Patna Junction' },
  { id: 'GKP', name: 'Gorakhpur Junction' },
  { id: 'LKO', name: 'Lucknow Junction' },
  { id: 'CNB', name: 'Kanpur Central' },
  { id: 'NDLS', name: 'New Delhi' },
  { id: 'JP', name: 'Jaipur Junction' },
  { id: 'ADI', name: 'Ahmedabad Junction' },
  { id: 'CDG', name: 'Chandigarh' },
]

const getStationName = (id: string): string => {
  const station = STATIONS_DATA.find((s) => s.id === id)
  return station ? station.name : id
}

// Base simulation clock at a fixed local time for consistency
const getSimBaseNow = (): Date => {
  const d = new Date()
  d.setHours(15, 30, 0, 0)
  return d
}

const generateLiveStatus = (now: Date = new Date()): TrainStatusItem[] => {
  const data: TrainStatusItem[] = []
  const currentTime = now.getTime()

  TRAINS_DATA.forEach((train) => {
    const trainNo = train.train_no
    const trainSchedules = SCHEDULES_DATA.filter((s) => s.train_no === trainNo)
    if (trainSchedules.length < 2) return

    const sourceStation = trainSchedules[0]
    const destStation = trainSchedules[trainSchedules.length - 1]

    const departureTime = new Date(now.toDateString() + ' ' + sourceStation.departure).getTime()

    let status: TrainStatusItem['status'] = 'On Time'
    let delay = 0
    let nextStation = ''
    let currentDeparture = sourceStation.departure
    let currentArrival = destStation.arrival
    const platform = (parseInt(trainNo.slice(-1)) % 10) + 1

    let currentLegIndex = -1
    for (let i = 0; i < trainSchedules.length; i++) {
      const stop = trainSchedules[i]
      if (stop.departure) {
        const stopTime = new Date(now.toDateString() + ' ' + stop.departure).getTime()
        if (stopTime <= currentTime) {
          currentLegIndex = i
        } else {
          break
        }
      }
    }

    if (currentLegIndex === -1) {
      status = 'Boarding'
      const timeUntilDeparture = departureTime - currentTime
      if (timeUntilDeparture < 0 && timeUntilDeparture > -600000) {
        delay = 10
        status = 'Delayed'
      }
      nextStation = getStationName(trainSchedules[1].station_id)
    } else if (currentLegIndex < trainSchedules.length - 1) {
      const nextStop = trainSchedules[currentLegIndex + 1]
      nextStation = getStationName(nextStop.station_id)

      if (trainNo === '12010') {
        status = 'Delayed'
        delay = 25
      } else if (trainNo === '12025') {
        status = 'Boarding'
      } else if (trainNo === '12053') {
        status = 'Cancelled'
        nextStation = 'N/A'
      }

      currentDeparture = trainSchedules[currentLegIndex].departure
    } else {
      status = 'Arrived'
      nextStation = 'Final Destination'
    }

    // Progress estimation (smooth within leg)
    let progress = 0
    const denom = Math.max(1, trainSchedules.length - 1)
    if (status === 'Arrived') {
      progress = 100
    } else if (currentLegIndex >= 0 && currentLegIndex < trainSchedules.length) {
      const currentStop = trainSchedules[currentLegIndex]
      const nextIdx = Math.min(currentLegIndex + 1, trainSchedules.length - 1)
      const nextStop = trainSchedules[nextIdx]

      const legStartStr = currentStop.departure || currentStop.arrival || '00:00'
      const legEndStr = nextStop.arrival || nextStop.departure || legStartStr
      const legStart = new Date(now.toDateString() + ' ' + legStartStr).getTime()
      const legEnd = new Date(now.toDateString() + ' ' + legEndStr).getTime()
      let legFrac = 0
      if (legEnd > legStart) {
        legFrac = (currentTime - legStart) / (legEnd - legStart)
        legFrac = Math.min(1, Math.max(0, legFrac))
      }
      const base = currentLegIndex / denom
      progress = Math.round(Math.min(1, Math.max(0, base + legFrac / denom)) * 100)
    }

    data.push({
      id: trainNo,
      name: train.train_name,
      from: getStationName(train.from_station),
      to: getStationName(train.to_station),
      departure: currentDeparture,
      arrival: currentArrival,
      status,
      delay,
      nextStation,
      platform,
      progress,
    })
  })

  return data
}

const initialTrainData: TrainStatusItem[] = generateLiveStatus(getSimBaseNow())

/**
 * @hook useTrainStatus - Simulates the backend data access layer.
 */
export const useTrainStatus = (): UseTrainStatusReturn => {
  const [trains, setTrains] = useState<TrainStatusItem[]>(initialTrainData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const offsetMinRef = useRef<number>(0) // accelerated minutes offset from base

  const updateTrainStatus = useCallback<UseTrainStatusReturn['updateTrainStatus']>((trainId, status, delay, currentNextStation) => {
    if (!trainId) return
    setTrains((prev) =>
      prev.map((t) => {
        if (t.id !== trainId) return t
        return {
          ...t,
          status,
          delay: status === 'Delayed' ? parseInt(String(delay)) : 0,
          nextStation: status === 'Cancelled' ? 'Due to Operational Issues' : currentNextStation || t.nextStation || 'En Route',
        }
      })
    )
  }, [])

  useEffect(() => {
    // Recalculate live status on an interval to simulate live updates with accelerated time
    setLoading(true)
    setTrains(generateLiveStatus(getSimBaseNow()))
    setLoading(false)
    const interval = setInterval(() => {
      offsetMinRef.current += 1 // advance simulated clock by 1 minute per tick
      const shiftedNow = new Date(getSimBaseNow().getTime() + offsetMinRef.current * 60_000)
      const fresh = generateLiveStatus(shiftedNow)
      const jittered: TrainStatusItem[] = fresh.map((t): TrainStatusItem => {
        const r = Math.random()
        let status: TrainStatusItem['status'] = t.status
        let delay = t.delay
        if (t.status === 'Delayed') {
          const delta = Math.floor(Math.random() * 3) - 1 // -1..+1
          delay = Math.max(0, t.delay + delta)
        } else if (t.status === 'On Time' && r < 0.08) {
          status = 'Delayed'
          delay = 5
        }
        return { ...t, status, delay }
      })
      setTrains(jittered)
    }, 60000) // refresh every 1 minute
    return () => clearInterval(interval)
  }, [])

  const resetSimulation = () => { offsetMinRef.current = 0 }

  return { trains, loading, error, updateTrainStatus, resetSimulation }
}
