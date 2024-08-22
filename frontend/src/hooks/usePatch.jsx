import { useState } from 'react';

const usePatch = (url, idToken) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateData = async (patchData) => {
        //console.log(patchData);
        setLoading(false);
        setError(null);
            if (!idToken) {
                setError({"error": "You are not authorized for this action"})
                return;
            }
            try {
                const response = await fetch(url, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(patchData),
                });
                if (!response.ok) {
                    throw new Error (`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
    return {data, setData, loading, error, updateData};
}

export default usePatch;