export function sleep(time = 20) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
