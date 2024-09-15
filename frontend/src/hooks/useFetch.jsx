import { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';

function useFetch(url, method = 'GET', body = null) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false);
            return;
        }

        setError(null);

        try {
            const response = await api({
                url,
                method,
                data: body,
            });
            setData(response.data);
        } catch (error) {
            if (error.response) {
                setError(`Error: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                setError('Error: no response from server');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }

    }, [url, method, body]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };

}

export default useFetch;

