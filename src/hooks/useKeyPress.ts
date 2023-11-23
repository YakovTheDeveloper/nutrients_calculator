import { useEffect } from "react";

// type Args = { key: string; callback: () => void }[];
type Args = Record<string, VoidFunction>;

export const useKeyPressed2 = (keyToCallbackMapping: Args) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log("e.key", e.key);
      if (e.key in keyToCallbackMapping) {
        const callback = keyToCallbackMapping[e.key];
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyToCallbackMapping]);
};

export const useKeyPressed = (key: string, callback: () => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.key === key && callback();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback]);
};
