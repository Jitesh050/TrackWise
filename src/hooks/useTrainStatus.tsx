import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getAllStationsWithNames, getAllTrains, getTrainSchedule } from '@/lib/train-sim'

// --- Types ---
// TrainRecord is compatible with SimTrain
export interface TrainRecord {
  train_no: string
  train_name: string
  from_station: string
  to_station: string
  category: string
}

// ScheduleRecord is compatible with SimStop
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

// --- Load simulation data ---
const TRAINS_DATA: TrainRecord[] = getAllTrains() as unknown as TrainRecord[]

// Build station name map from simulation helper
const STATION_NAME_MAP: Record<string, string> = (() => {
  const entries = getAllStationsWithNames()
  const map: Record<string, string> = {}
  entries.forEach((s: any) => { map[s.code] = s.name })
  return map
})()

const getStationName = (id: string): string => STATION_NAME_MAP[id] || id

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
    const trainSchedules = (getTrainSchedule(trainNo) as unknown as ScheduleRecord[]) || []
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
      // Before first departure
      status = 'Boarding'
      const timeUntilDeparture = departureTime - currentTime
      // No randomness; treat pre-departure as Boarding
      nextStation = getStationName(trainSchedules[1].station_id)
    } else if (currentLegIndex < trainSchedules.length - 1) {
      const nextStop = trainSchedules[currentLegIndex + 1]
      nextStation = getStationName(nextStop.station_id)
      // Deterministic: mark Delayed only if current time has passed expected arrival at nextStop
      const nextArrStr = nextStop.arrival || nextStop.departure || '00:00'
      const nextArr = new Date(now.toDateString() + ' ' + nextArrStr).getTime()
      if (currentTime > nextArr) {
        status = 'Delayed'
        delay = Math.floor((currentTime - nextArr) / 60000)
      } else {
        status = 'On Time'
        delay = 0
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
    // Recalculate live status deterministically on an interval with accelerated clock
    setLoading(true)
    setTrains(generateLiveStatus(getSimBaseNow()))
    setLoading(false)
    const interval = setInterval(() => {
      offsetMinRef.current += 1 // advance simulated clock by 1 minute per tick
      const shiftedNow = new Date(getSimBaseNow().getTime() + offsetMinRef.current * 60_000)
      const fresh = generateLiveStatus(shiftedNow)
      setTrains(fresh)
    }, 60000) // refresh every 1 minute
    return () => clearInterval(interval)
  }, [])

  const resetSimulation = () => { offsetMinRef.current = 0 }

  return { trains, loading, error, updateTrainStatus, resetSimulation }
}
