import { useState, useEffect, useCallback } from 'react';

function useFetch(url, idToken) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(0); // Used to trigger refetch

    const fetchData = useCallback(async () => {
        if (!idToken || !url) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [url, idToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData, trigger]);

    const refetch = () => {
        setTrigger(prev => prev + 1); // Change trigger state to force refetch
    };

    return { data, loading, error, refetch };
}

export default useFetch;
