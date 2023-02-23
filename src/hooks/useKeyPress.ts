import { useEffect } from "react";

export const useKeyPressed = (key: string, callback: () => void) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.key === key && callback();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [callback]);
};
