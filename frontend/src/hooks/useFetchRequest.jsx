import { useState, useCallback} from 'react';
import api from '../utils/axios';

const useFetchRequest = (endpoint) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!endpoint) {
            return;
        }
        setError(null);
        setLoading(true);
        
        try {
          const res = await api.get(endpoint);
          setData(res.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
        
    return { data, loading, error, fetchData};
}

export default useFetchRequest;