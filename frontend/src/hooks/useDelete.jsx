import { useState } from 'react';
import api from '../utils/axios';

const useDeleteData = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const deleteEntry = async () => {
      if (!endpoint) {
        return;
      }
        setLoading(true);
        setError(null);
        try {
          const config = {
            headers: {
              "Content-type": "application/json"
            },
            data: data,
          }
          const res = await api.delete(endpoint, config);
          setResponse(res.data);
        } catch (err) {
          setError(err);
        }
        finally {
          setLoading(false)
        }
      };

      return { setData, response, loading, error, deleteEntry};
};

export default useDeleteData;