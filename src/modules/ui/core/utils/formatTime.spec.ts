import formatTime from './formatTime';

describe('formatTime', () => {
  test('should return valid string', () => {
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(Infinity)).toBe('00:00');
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(10)).toBe('00:10');
    expect(formatTime(110)).toBe('01:50');
    expect(formatTime(11100)).toBe('03:05:00');
  });
});
