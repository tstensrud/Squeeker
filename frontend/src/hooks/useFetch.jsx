import { useState, useEffect, useCallback } from 'react';

function useFetch(url, idToken) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!url) {
            console.log("Url was not provided", url)
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let response;
            if (!idToken) {
                response = await fetch(url, {
                    method: "GET",
                });

            } else {
                response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
            }

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
    }, [url, idToken, fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export default useFetch;
