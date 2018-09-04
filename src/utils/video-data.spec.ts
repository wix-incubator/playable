import { expect } from 'chai';

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
  it('should return null if invalid buffer provided', () => {
    const buffer: any = null;

    expect(getNearestBufferSegmentInfo(buffer)).to.be.equal(null);
  });

  it('should return proper size of buffer', () => {
    const buffer = getValidBuffer([[2, 10], [30, 40]]);

    expect(getNearestBufferSegmentInfo(buffer, 3)).to.be.deep.equal({
      start: 2,
      end: 10,
    });

    expect(getNearestBufferSegmentInfo(buffer, 35)).to.be.deep.equal({
      start: 30,
      end: 40,
    });
  });
});

describe('geOverallBufferLength', () => {
  it('should return 0 if invalid buffer provided', () => {
    const buffer: any = null;

    expect(geOverallBufferLength(buffer)).to.be.equal(0);
  });

  it('should return proper size of buffer', () => {
    const buffer = getValidBuffer([[0, 10]]);

    expect(geOverallBufferLength(buffer)).to.be.equal(10);
  });
});

describe('getOverallBufferedPercent', () => {
  it('should return 0 if invalid buffer provided', () => {
    const buffer: any = null;

    expect(getOverallBufferedPercent(buffer)).to.be.equal(0);
  });

  it('should return 0 if invalid duration is 0', () => {
    const buffer = getValidBuffer([[0, 1]]);

    expect(getOverallBufferedPercent(buffer, 0, 0)).to.be.equal(0);
  });

  it('should return calculated percent', () => {
    const buffer = getValidBuffer([[0, 1], [2, 5]]);
    const currentTime1 = 0;
    const currentTime2 = 3;
    const duration1 = 5;
    const duration2 = 7;

    expect(
      getOverallBufferedPercent(buffer, currentTime1, duration1),
    ).to.be.equal(20);
    expect(
      getOverallBufferedPercent(buffer, currentTime1, duration2),
    ).to.be.equal(14.29);
    expect(
      getOverallBufferedPercent(buffer, currentTime2, duration1),
    ).to.be.equal(100);
    expect(
      getOverallBufferedPercent(buffer, currentTime2, duration2),
    ).to.be.equal(71.43);
  });
});

describe('getOverallPlayedPercent', () => {
  it('should return 0 if no duration provided', () => {
    const currentTime = 10;
    const duration = 0;

    expect(getOverallPlayedPercent()).to.be.equal(0);
    expect(getOverallPlayedPercent(currentTime)).to.be.equal(0);
    expect(getOverallPlayedPercent(currentTime, duration)).to.be.equal(0);
  });

  it('should return calculated percent', () => {
    const currentTime1 = 10;
    const currentTime2 = 90;
    const duration1 = 20;
    const duration2 = 90;

    expect(getOverallPlayedPercent(currentTime1, duration1)).to.be.equal(50);
    expect(getOverallPlayedPercent(currentTime2, duration2)).to.be.equal(100);
  });
});
