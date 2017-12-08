import * as flow from 'lodash/flow';
import VideoPlayer from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';

/* ignore coverage */
const DEFAULT_URL = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

/* ignore coverage */
const parseQuery = qstr =>
  (qstr[0] === '?' ? qstr.substr(1) : qstr)
    .split('&')
    .reduce((parsedQuery, queryElement) => {
      const b = queryElement.split('=');
      const value = decodeURIComponent(b[1] || '');

      if (!isNaN(Number(value))) {
        parsedQuery[decodeURIComponent(b[0])] = Number(value);
      } else if (value === 'false') {
        parsedQuery[decodeURIComponent(b[0])] = false;
      } else if (value === 'true') {
        parsedQuery[decodeURIComponent(b[0])] = true;
      } else {
        parsedQuery[decodeURIComponent(b[0])] = value;
      }

      return parsedQuery;
    }, {});

/* ignore coverage */
const getURLFromQuery = ({ url = DEFAULT_URL, type }) =>
  type ? { url, type } : url;

VideoPlayer.registerPlaybackAdapter(HLSAdapter);
VideoPlayer.registerPlaybackAdapter(DASHAdapter);

/* ignore coverage */
const player: any = VideoPlayer.create({
  autoPlay: false,
  muted: false,
  loop: false,
  preload: 'metadata',
  volume: 100,
  fillAllSpace: false,
  size: {
    width: 760,
    height: 428,
  },
  loadingCover:
    'https://www.pets4homes.co.uk/images/breeds/142/large/184f5cc944e278ad4a20f70258b75cdd.jpg',
  src: flow([parseQuery, getURLFromQuery])(window.location.search),
  controls: {
    logo: {
      showAlways: true,
      src:
        'https://www.file-extensions.org/imgs/app-icon/128/10395/wix-icon.png',
    },
  },
  logger: ({ reason, startTS, endTS }) => {
    // tslint:disable-next-line
    console.log(`REASON: ${reason}; startTS: ${startTS}; endTS: ${endTS}`); // eslint-disable-line no-console
  },
  overlay: false,
});

Reflect.defineProperty(window, 'player', {
  value: player,
});

function getStreamStatus() {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open(
    'GET',
    'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream',
  );
  oReq.send();

  function reqListener() {
    const json = JSON.parse(oReq.responseText);
    document.getElementById('stream-status').innerHTML = `status: ${
      json.ongoing ? 'ongoning' : 'ended'
    }`;
    setTimeout(getStreamStatus, 2000);
  }
}

function getEventStatus() {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open(
    'GET',
    'https://video-player-media-server-dot-wixgamma.appspot.com/live/event',
  );
  oReq.send();

  function reqListener() {
    const json = JSON.parse(oReq.responseText);
    document.getElementById('event-status').innerHTML = `status: ${
      json.ongoing ? 'ongoning' : 'ended'
    }`;
    setTimeout(getEventStatus, 2000);
  }
}

/* ignore coverage */
document.addEventListener('DOMContentLoaded', () => {
  player.attachToElement(document.getElementById('player-wrapper'));

  getStreamStatus();
  getEventStatus();

  document.getElementById('start-stream').addEventListener('click', () => {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/start',
    );
    oReq.send();
  });

  document
    .getElementById('load-stream-to-player')
    .addEventListener('click', () => {
      player.setSrc({
        url:
          'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/manifest.m3u8',
        type: 'HLS',
      });
      player.play();
    });

  document.getElementById('end-stream').addEventListener('click', () => {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/end',
    );
    oReq.send();
  });

  document.getElementById('start-event').addEventListener('click', () => {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      'https://video-player-media-server-dot-wixgamma.appspot.com/live/event/start',
    );
    oReq.send();
  });

  document
    .getElementById('load-event-to-player')
    .addEventListener('click', () => {
      player.setSrc({
        url:
          'https://video-player-media-server-dot-wixgamma.appspot.com/live/event/manifest.m3u8',
        type: 'HLS',
      });
      player.play();
    });

  document.getElementById('end-event').addEventListener('click', () => {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      'https://video-player-media-server-dot-wixgamma.appspot.com/live/event/end',
    );
    oReq.send();
  });
});
