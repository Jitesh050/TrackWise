import { useTrainStatus } from '../src/hooks/useTrainStatus';
// import { render } from '@testing-library/react';

const start = performance.now();
// const { trains } = useTrainStatus(); // Not rendering it fully here
const end = performance.now();

console.log(`Initial render took ${end - start} ms`);
