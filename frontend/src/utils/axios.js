import axios from 'axios';
import { auth } from '../utils/firebase';
import { BASE_URL } from '../utils/globalVariables';

const api = axios.create({
    baseURL: `${BASE_URL}/`
});

api.interceptors.request.use(
    async(config) => {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            config.headers.Authorization = `Bearer ${idToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized. Log in');
        }
        return Promise.reject(error);
    }
)

export default api;