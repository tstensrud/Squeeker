import { useState } from 'react';
import api from '../utils/axios';

const useSubmit = (endpoint) => {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitData = async (newData) => {
        if (!endpoint) {
            return;
        }
        setError(null);
        setLoading(true);
        
        try {
          const res = await api.post(endpoint, newData);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
        
    return {response, loading, error, submitData};
}

export default useSubmit;