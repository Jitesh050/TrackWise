import { useTrainStatus } from './src/hooks/useTrainStatus';
import trainsData from './simulation/trains_100.json';
import schedulesData from './simulation/schedules_100.json';
import { getAllStationsWithNames } from './src/lib/train-sim';

const TRAINS_DATA = trainsData;
const SCHEDULES_DATA = schedulesData;

const STATION_NAME_MAP: Record<string, string> = (() => {
  const entries = getAllStationsWithNames()
  const map: Record<string, string> = {}
  entries.forEach((s: any) => { map[s.code] = s.name })
  return map
})()

const getStationName = (id: string): string => STATION_NAME_MAP[id] || id

const getSimBaseNow = (): Date => {
  const d = new Date()
  d.setHours(15, 30, 0, 0)
  return d
}

// Unoptimized
const generateLiveStatusUnoptimized = (now: Date = new Date()) => {
  const data: any[] = []
  const currentTime = now.getTime()

  TRAINS_DATA.forEach((train: any) => {
    const trainNo = train.train_no
    const trainSchedules = SCHEDULES_DATA.filter((s: any) => s.train_no === trainNo)
    if (trainSchedules.length < 2) return

    const sourceStation = trainSchedules[0]
    const destStation = trainSchedules[trainSchedules.length - 1]
    const departureTime = new Date(now.toDateString() + ' ' + sourceStation.departure).getTime()

    // simulate a bit of work
    data.push({ id: trainNo })
  })

  return data
}

// Optimized
const SCHEDULES_BY_TRAIN: Record<string, any[]> = {};
SCHEDULES_DATA.forEach((s: any) => {
  if (!SCHEDULES_BY_TRAIN[s.train_no]) {
    SCHEDULES_BY_TRAIN[s.train_no] = [];
  }
  SCHEDULES_BY_TRAIN[s.train_no].push(s);
});

const generateLiveStatusOptimized = (now: Date = new Date()) => {
  const data: any[] = []
  const currentTime = now.getTime()

  TRAINS_DATA.forEach((train: any) => {
    const trainNo = train.train_no
    const trainSchedules = SCHEDULES_BY_TRAIN[trainNo] || []
    if (trainSchedules.length < 2) return

    const sourceStation = trainSchedules[0]
    const destStation = trainSchedules[trainSchedules.length - 1]
    const departureTime = new Date(now.toDateString() + ' ' + sourceStation.departure).getTime()

    // simulate a bit of work
    data.push({ id: trainNo })
  })

  return data
}

console.time('Unoptimized 1000x');
for (let i = 0; i < 1000; i++) {
  generateLiveStatusUnoptimized(getSimBaseNow());
}
console.timeEnd('Unoptimized 1000x');

console.time('Optimized 1000x');
for (let i = 0; i < 1000; i++) {
  generateLiveStatusOptimized(getSimBaseNow());
}
console.timeEnd('Optimized 1000x');
