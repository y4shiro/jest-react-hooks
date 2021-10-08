import { useCallback, useState } from 'react';

export type UseCounterReturnType = {
  count: number;
  increment: () => void;
};

export const useCounter = (): UseCounterReturnType => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((n) => n + 1), []);

  return { count, increment };
};
