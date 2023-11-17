import { useCallback, useState } from 'react';

// https://www.youtube.com/watch?v=lyNetvEfvT0

function useAsyncFn(func) {
    const [value, setValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback((...params) => {
        setIsLoading(true);
        return func(...params)
            .then((data) => {
                setValue(data);
                setError(undefined);
                return data;
            })
            .catch((err) => {
                setError(err);
                setValue(undefined);
                return Promise.reject(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [func]);

    return {
        value,
        isLoading,
        error,
        execute,
    };
}

export { useAsyncFn };