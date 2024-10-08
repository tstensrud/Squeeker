import { useState } from 'react';
import api from '../utils/axios';

const usePatch = (endpoint) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const updateData = async (updatedData) => {
        if (!endpoint) {
            return;
        }
        setError(null);
        setLoading(true);
        
        try {
          const res = await api.patch(endpoint, updatedData);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
        
    return { response, loading, error, updateData};
}

export default usePatch;