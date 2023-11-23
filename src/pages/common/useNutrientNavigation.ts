import { useCallback, useMemo, useRef } from 'react';

export const useNutrientNavigation = () => {
    const scrollRefs = Object.keys([1, 2, 3, 4, 5, 6, 7]).map(() => useRef(null));
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClick = useCallback((index: number) => {
        if (scrollRefs[index].current && containerRef.current) {
            const element = scrollRefs[index].current;
            const container = containerRef.current;

            // Calculate the element's position relative to the container
            const offsetTop = element?.offsetTop - container?.offsetTop;

            if (offsetTop !== undefined && container.scrollTo) {
                container.scrollTo({
                    top: offsetTop
                });
            }

        }
    },[scrollRefs,containerRef]);

    return {
        containerRef,
        scrollRefs,
        navigate: handleClick
    };
};