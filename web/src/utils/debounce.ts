export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  timeout = 300
) => {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.call(null, args);
    }, timeout);
  };
};
