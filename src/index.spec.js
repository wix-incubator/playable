import 'jsdom-global/register';

import { expect } from 'chai';

import VideoPlayer from './index';

describe('root file', () => {
  it('should provide link for player contructor', () => {
    expect(VideoPlayer).to.exist;
  });
});
