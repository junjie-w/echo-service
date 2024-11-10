import { measureExecutionTime } from '../../../utils/timing.js';

describe('measureExecutionTime', () => {
  it('should measure execution time of an operation', () => {
    const operation = () => {
      const sum = Array(1000).fill(1).reduce((a, b) => a + b, 0);
      return sum;
    };

    const result = measureExecutionTime(operation);

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('processingTime');
    expect(typeof result.processingTime).toBe('string');
    expect(result.data).toBe(1000);
  });

  it('should return timing data in the correct format', () => {
    const simpleOperation = () => 'test';
    const result = measureExecutionTime(simpleOperation);

    expect(result.processingTime).toMatch(/^\d+\.\d{6}$/);
  });
});
