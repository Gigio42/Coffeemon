import { useEffect, useState } from "react";

export function useOptimisticUpdate<T>(
  serverValue: T,
  resetDelay: number = 2000
): [T, (value: T) => void] {
  const [optimisticValue, setOptimisticValue] = useState<T | null>(null);

  useEffect(() => {
    if (optimisticValue !== null) {
      const timeout = setTimeout(() => {
        setOptimisticValue(null);
      }, resetDelay);

      return () => clearTimeout(timeout);
    }
  }, [optimisticValue, resetDelay]);

  const setOptimistic = (value: T) => {
    setOptimisticValue(value);
  };

  return [optimisticValue ?? serverValue, setOptimistic];
}
