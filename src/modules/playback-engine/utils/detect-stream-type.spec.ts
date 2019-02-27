import 'jsdom-global';
import { expect } from 'chai';
import { getStreamType } from './detect-stream-type';
import { MediaStreamType } from '../../../constants';

describe('Stream type auto detection', function() {
  const testURL = 'http://mocked-domain.com/some/internalPath/';
  const formatsToTest = [
    { type: MediaStreamType.MP4, fileName: 'video.mp4' },
    { type: MediaStreamType.WEBM, fileName: 'video.webm' },
    { type: MediaStreamType.HLS, fileName: 'video.m3u8' },
    { type: MediaStreamType.DASH, fileName: 'video.mpd' },
  ];

  formatsToTest.forEach(formatToTest => {
    it(`should detect ${formatToTest.type} URLs`, function() {
      const URL = testURL + formatToTest.fileName;

      expect(getStreamType(URL)).to.equal(formatToTest.type);
    });
  });

  describe('when receive ULR', () => {
    const mp4URL = testURL + 'video.mp4';
    const queryParam = '?data=true';
    const fragment = '#sectionOnPage';

    it('should detect type even if it has query params', () => {
      expect(getStreamType(mp4URL + queryParam)).to.equal(MediaStreamType.MP4);
    });

    it('should detect type even if it has fragments', () => {
      expect(getStreamType(mp4URL + fragment)).to.equal(MediaStreamType.MP4);
    });

    it('should detect type even if it has fragments and params', () => {
      expect(getStreamType(mp4URL + queryParam + fragment)).to.equal(
        MediaStreamType.MP4,
      );
    });
  });

  it("should throw error if can't parse url", () => {
    expect(getStreamType('test.url')).to.equal(false);
  });
});
