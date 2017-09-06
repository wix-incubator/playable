import over from 'lodash/over';
import VideoPlayer from './index';

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
const getURLFromQuery = ({ url = DEFAULT_URL, type }) => (type ? { url, type } : url);

/* ignore coverage */
window.player = VideoPlayer.create({
  autoPlay: false,
  muted: false,
  loop: false,
  preload: 'auto',
  volume: 100,
  fillAllSpace: false,
  size: {
    width: 760,
    height: 428
  },
  loadingCover: 'https://www.pets4homes.co.uk/images/breeds/142/large/184f5cc944e278ad4a20f70258b75cdd.jpg',
  src: over([parseQuery, getURLFromQuery])(window.location.search),
  controls: {
    watchOnSite: {
      url: 'http://www.wix.com/',
      showAlways: true,
      logo: 'https://www.file-extensions.org/imgs/app-icon/128/10395/wix-icon.png'
    }
  },
  texts: {
    [VideoPlayer.TEXT_LABELS.WATCH_ON_SITE_TOOLTIP]: 'Watch On Site'
  },
  logger: ({ reason, startTS, endTS }) => {
    console.log(`REASON: ${reason}; startTS: ${startTS}; endTS: ${endTS}`); // eslint-disable-line no-console
  },
  overlay: false
});

/* ignore coverage */
document.addEventListener('DOMContentLoaded', () => {
  window.player.attachToElement(document.body);
});
