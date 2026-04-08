import fs from 'fs';
const trainsData = JSON.parse(fs.readFileSync('./simulation/trains_100.json', 'utf8'));
const schedulesData = JSON.parse(fs.readFileSync('./simulation/schedules_100.json', 'utf8'));

const TRAINS_DATA = trainsData;
const SCHEDULES_DATA = schedulesData;

const start = performance.now();
for(let i=0; i<1000; i++) {
  const data = [];
  TRAINS_DATA.forEach((train: any) => {
    const trainNo = train.train_no;
    const trainSchedules = SCHEDULES_DATA.filter((s: any) => s.train_no === trainNo);
    if (trainSchedules.length < 2) return;
  });
}
console.log("Original:", performance.now() - start);

const start2 = performance.now();
const SCHEDULES_BY_TRAIN = new Map();
SCHEDULES_DATA.forEach((s: any) => {
  const list = SCHEDULES_BY_TRAIN.get(s.train_no) || [];
  list.push(s);
  SCHEDULES_BY_TRAIN.set(s.train_no, list);
});
for(let i=0; i<1000; i++) {
  const data = [];
  TRAINS_DATA.forEach((train: any) => {
    const trainNo = train.train_no;
    const trainSchedules = SCHEDULES_BY_TRAIN.get(trainNo) || [];
    if (trainSchedules.length < 2) return;
  });
}
console.log("Optimized:", performance.now() - start2);
