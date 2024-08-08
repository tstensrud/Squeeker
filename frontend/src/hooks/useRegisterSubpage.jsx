import { useState } from 'react';

const useRegisterSubpage = (url, idToken) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const registerSubpage = async (userData) => {
        setLoading(false);
        setError(null);
        
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (!response.ok) {
                    throw new Error (`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

    return {data, setData, loading, error, registerSubpage};
}

export default useRegisterSubpage;