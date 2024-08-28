import { useState } from 'react';

const useDelete = (url, idToken) => {
    const [response, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteEntry = async (deleteData) => {
        setLoading(false);
        setError(null);
            if (!idToken) {
                setError({"error": "You are not authorized for this action"})
                return;
            }

           //console.log("ID TOKEN: ", idToken)
            try {
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(deleteData),
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
        
    return {response, setData, loading, error, deleteEntry};
}

export default useDelete;