import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Improve the interceptor to handle token correctly
api.interceptors.request.use(
    (config) => {
        try {
            const authUserString = localStorage.getItem('authUser');
            if (authUserString) {
                const authUser = JSON.parse(authUserString);
                if (authUser && authUser.access_token) {
                    // Make sure to use the correct authorization header format your backend expects
                    config.headers.Authorization = `Bearer ${authUser.access_token}`;
                }
            }
        } catch (error) {
            console.error('Error setting auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add this to your api.js file
api.interceptors.response.use(
    (response) => {
        console.log('API Response Success:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.config?.url, error.response?.status);
        console.error('Error details:', error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
