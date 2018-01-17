function formatTime(seconds: number): string {
  const isValid = !isNaN(seconds) && isFinite(seconds);
  const isNegative = isValid && seconds < 0;
  const date = new Date(null);

  date.setSeconds(isValid ? Math.abs(Math.floor(seconds)) : 0);

  // get HH:mm:ss part, remove hours if they are "00:"
  const time = date
    .toISOString()
    .substr(11, 8)
    .replace(/^00:/, '');

  return isNegative ? `-${time}` : time;
}

export default formatTime;
