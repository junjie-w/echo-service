import type { TimedResponse } from '../types/index.js';

export const measureExecutionTime = <T>(operation: () => T): TimedResponse<T> => {
  const startTime = process.hrtime();
  const data = operation();
  const endTime = process.hrtime(startTime);
  const processingTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(6);

  return { data, processingTime };
};
