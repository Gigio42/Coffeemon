import { useState, useCallback } from "react";

export function useBattleLog() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    console.log("[Battle Log]:", msg);
    setLog((prev) => [...prev, msg]);
  }, []);

  const clearLog = useCallback(() => {
    setLog([]);
  }, []);

  return {
    log,
    addLog,
    clearLog,
  };
}
