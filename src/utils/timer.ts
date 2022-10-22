export async function wait(duration: number) {
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve(null);
    }, duration);
  });
}
