const fs = require('fs');
const path = require('path');

const mimeTypes = {
    mp4: 'video/mp4',
    m4s: 'video/mp4',
    m3u8: 'application/vnd.apple.mpegurl',
    webm: 'video/webm',
    ts: 'video/MP2T',
    mpd: 'application/dash+xml'
};

function readRangeHeader(range, totalLength) {
    /*
     * Example of the method 'split' with regular expression.
     *
     * Input: bytes=100-200
     * Output: [null, 100, 200, null]
     *
     * Input: bytes=-200
     * Output: [null, null, 200, null]
     */
    if (range == null || range.length == 0)
        return null;
    const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    const start = parseInt(array[1]);
    const end = parseInt(array[2]);
    const result = {
        start: isNaN(start) ? 0 : start,
        end: isNaN(end) ? (totalLength - 1) : end
    };
    if (!isNaN(start) && isNaN(end)) {
        result.start = start;
        result.end = totalLength - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
        result.start = totalLength - end;
        result.end = totalLength - 1;
    }
    return result;
}

module.exports = function generateResponse(req, res) {
  function printMessage(message, responseCode) {
      res.writeHead(responseCode, { 'Content-Type': 'text/plain' });
      res.write(message);
      res.end();
  }
  const fileName = path.resolve(__dirname, path.join('./assets/', req.params.fileName));
  fs.exists(fileName, (exists) => {
      if (!exists) {
          printMessage('File not found: ' + req.params.fileName, 404);
      }
      else {
          console.log('Sending file: ' + fileName);
          const ext = path.extname(req.params.fileName).slice(1);
          const mimeType = mimeTypes[ext];
          const fileSize = fs.statSync(fileName).size;
          const rangeRequest = readRangeHeader(req.headers.range, fileSize);
          if (mimeType) {
              const options = {};
              if (rangeRequest) {
                  const { start, end } = rangeRequest;
                  if (start >= fileSize || end >= fileSize) {
                      res.writeHead(416, {
                          'Content-Range': 'bytes */' + fileSize
                      });
                  }
                  else {
                      res.writeHead(206, {
                          'Content-Type': mimeType,
                          'Access-Control-Allow-Origin': '*',
                          'Access-Control-Allow-Headers': 'Range',
                          'Accept-Ranges': 'bytes',
                          'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
                          'Content-Length': fileSize
                      });
                      options.start = start;
                      options.end = end;
                  }
              }
              else {
                  res.writeHead(200, {
                      'Content-Type': mimeType,
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Headers': 'Range',
                      'Accept-Ranges': 'bytes',
                      'Content-Length': fileSize
                  });
              }
              const stream = fs.createReadStream(fileName, options);
              stream.pipe(res);
          }
          else {
              printMessage('Unknown file type: ' + ext, 404);
          }
      }
  });
}
