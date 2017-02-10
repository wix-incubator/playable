import { expect } from 'chai';

import { getOverallBufferedPercent, getOverallPlayedPercent } from './video-data';

function getValidBuffer(seq) {
  return {
    start: i => seq[i][0],
    end: i => seq[i][1],
    length: seq.length
  }
}

describe('getOverallBufferedPercent', () => {
  it('should return 0 if invalid buffer provided', () => {
    const buffer1 = null;
    const buffer2 = [];

    expect(getOverallBufferedPercent(buffer1)).to.be.equal(0);
    expect(getOverallBufferedPercent(buffer2)).to.be.equal(0);
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

    expect(getOverallBufferedPercent(buffer, currentTime1, duration1)).to.be.equal('20.0');
    expect(getOverallBufferedPercent(buffer, currentTime1, duration2)).to.be.equal('14.3');
    expect(getOverallBufferedPercent(buffer, currentTime2, duration1)).to.be.equal('100.0');
    expect(getOverallBufferedPercent(buffer, currentTime2, duration2)).to.be.equal('71.4');
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

    expect(getOverallPlayedPercent(currentTime1, duration1)).to.be.equal('50.0');
    expect(getOverallPlayedPercent(currentTime2, duration2)).to.be.equal('100.0');
  });
});
