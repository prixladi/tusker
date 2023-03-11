export const delay = (delayInMs: number) =>
  new Promise((res) => setTimeout(res, delayInMs));
