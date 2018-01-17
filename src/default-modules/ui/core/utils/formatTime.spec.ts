import { expect } from 'chai';

import formatTime from './formatTime';

describe('formatTime', () => {
  it('should return valid string', () => {
    expect(formatTime(NaN)).to.be.equal('00:00');
    expect(formatTime(Infinity)).to.be.equal('00:00');
    expect(formatTime(0)).to.be.equal('00:00');
    expect(formatTime(10)).to.be.equal('00:10');
    expect(formatTime(110)).to.be.equal('01:50');
    expect(formatTime(11100)).to.be.equal('03:05:00');
  });
});
