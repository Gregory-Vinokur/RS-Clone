export default function formatTime(time: number | string) {
  let min = Math.floor(Number(time) / 60);
  if (min < 10) {
    min = Number(`0${min}`);
  }
  let sec = Math.floor(Number(time) % 60);
  if (sec < 10) {
    sec = Number(`0${sec}`);
  }
  if (sec === 0) {
    return `${min}:0${sec}`;
  }

  return `${min}:${sec}`;
}
