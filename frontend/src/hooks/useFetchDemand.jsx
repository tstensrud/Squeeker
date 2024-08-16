import { useState, useCallback} from 'react';

function useFetchDemand (url, idToken)  {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


        const fetchData = useCallback(async () => {
            if (!idToken) {
                setLoading(false);
                return;
            }
            if (!url) {
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
                    throw new Error (`Error: ${response.statusText}`);
                }
                const result = await response.json();
                //console.log(result);
                //console.log(response)
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        },[url, idToken]);

    return {data, loading, error, fetchData};
}

export default useFetchDemand;