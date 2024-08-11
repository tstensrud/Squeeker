import { useState, useEffect} from 'react';

const useFetch = (url, idToken) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!idToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error (`Error: ${response.statusText}`);
                }
                const result = await response.json();
                console.log(result);
                console.log(response)
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[url, idToken])

    return {data, loading, error};
}

export default useFetch;