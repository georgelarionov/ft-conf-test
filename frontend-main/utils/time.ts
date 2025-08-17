export const beautifyTime = (time: number) => {
  // Number in seconds
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  if (minutes < 10) minutes = `0${minutes}` as any;
  if (seconds < 10) seconds = `0${seconds}` as any;

  return `${minutes}:${seconds}`;
};
