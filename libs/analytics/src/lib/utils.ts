export const fakeFetch = (eventStack: any[]) => Promise.resolve({ json: () => Promise.resolve({}) });

export function throttle(func: (args?: any[]) => any, delay: number): () => any {
  let timeoutId: NodeJS.Timeout | null;
  let lastArgs: any[];

  return function (...args: any[]) {
    lastArgs = args;

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func(...lastArgs);
        timeoutId = null;
      }, delay);
    }
  };
}