import {
  getOverallBufferedPercent,
  getOverallPlayedPercent,
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from './video-data';

function getValidBuffer(seq: any) {
  return {
    start: (i: any) => seq[i][0],
    end: (i: any) => seq[i][1],
    length: seq.length,
  };
}

describe('getNearestBufferSegmentInfo', () => {
  test('should return null if invalid buffer provided', () => {
    const buffer: any = null;

    expect(getNearestBufferSegmentInfo(buffer)).toBe(null);
  });

  test('should return proper size of buffer', () => {
    const buffer = getValidBuffer([
      [2, 10],
      [30, 40],
    ]);

    expect(getNearestBufferSegmentInfo(buffer, 3)).toEqual({
      start: 2,
      end: 10,
    });

    expect(getNearestBufferSegmentInfo(buffer, 35)).toEqual({
      start: 30,
      end: 40,
    });
  });
});

describe('geOverallBufferLength', () => {
  test('should return 0 if invalid buffer provided', () => {
    const buffer: any = null;

    expect(geOverallBufferLength(buffer)).toBe(0);
  });

  test('should return proper size of buffer', () => {
    const buffer = getValidBuffer([[0, 10]]);

    expect(geOverallBufferLength(buffer)).toBe(10);
  });
});

describe('getOverallBufferedPercent', () => {
  test('should return 0 if invalid buffer provided', () => {
    const buffer: any = null;

    expect(getOverallBufferedPercent(buffer)).toBe(0);
  });

  test('should return 0 if invalid duration is 0', () => {
    const buffer = getValidBuffer([[0, 1]]);

    expect(getOverallBufferedPercent(buffer, 0, 0)).toBe(0);
  });

  test('should return calculated percent', () => {
    const buffer = getValidBuffer([
      [0, 1],
      [2, 5],
    ]);
    const currentTime1 = 0;
    const currentTime2 = 3;
    const duration1 = 5;
    const duration2 = 7;

    expect(getOverallBufferedPercent(buffer, currentTime1, duration1)).toBe(20);
    expect(getOverallBufferedPercent(buffer, currentTime1, duration2)).toBe(
      14.29,
    );
    expect(getOverallBufferedPercent(buffer, currentTime2, duration1)).toBe(
      100,
    );
    expect(getOverallBufferedPercent(buffer, currentTime2, duration2)).toBe(
      71.43,
    );
  });
});

describe('getOverallPlayedPercent', () => {
  test('should return 0 if no duration provided', () => {
    const currentTime = 10;
    const duration = 0;

    expect(getOverallPlayedPercent()).toBe(0);
    expect(getOverallPlayedPercent(currentTime)).toBe(0);
    expect(getOverallPlayedPercent(currentTime, duration)).toBe(0);
  });

  test('should return calculated percent', () => {
    const currentTime1 = 10;
    const currentTime2 = 90;
    const duration1 = 20;
    const duration2 = 90;

    expect(getOverallPlayedPercent(currentTime1, duration1)).toBe(50);
    expect(getOverallPlayedPercent(currentTime2, duration2)).toBe(100);
  });
});
