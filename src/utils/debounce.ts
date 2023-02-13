const debounce = (callback: <T>(...args: T[]) => void, delay = 250) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return <T>(...args: T[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // timeoutId = null;
      callback(...args);
    }, delay);
  };
};

export default debounce;
