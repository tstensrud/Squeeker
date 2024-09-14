import { useState } from 'react';

const useSubpagePost = (url, idToken) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const subpagePost = async (subpageData) => {
        setLoading(true);
        setError(null);
            if (!idToken) {
                setError({"error": "You are not authorized for this action"})
                return;
            }

           //console.log("ID TOKEN: ", idToken)
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subpageData),
                });
                //console.log("Response: ", response);
                if (!response.ok) {
                    throw new Error (`Error: ${response.statusText}`);
                }
                const result = await response.json();
                //console.log("Result: ", result);
                setData(result);
                //console.log(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
    return {data, setData, loading, error, subpagePost};
}

export default useSubpagePost;