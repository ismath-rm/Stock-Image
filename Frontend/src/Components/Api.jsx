
import axios from 'axios';
import { BASE_URL } from '../constant/Constant';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // Add other configurations like timeout, headers, etc., if needed
});

// Request interceptor to add token to the headers
axiosInstance.interceptors.request.use(
    config => {
        const access = localStorage.getItem('access');
        if (access) {
            config.headers['Authorization'] = 'Bearer ' + access;
            console.log("Using access token:", access);
        } else {
            console.warn("No access token found");
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// // Response interceptor to handle token refresh
// axiosInstance.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         // Check if it’s a 401 error and retry flag is not set
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const refresh = localStorage.getItem('refresh');
            
//             if (!refresh) {
//                 console.error("No refresh token found in localStorage");
//                 return Promise.reject(error);
//             }

//             try {
//                 // Log the refresh attempt
//                 console.log("Attempting to refresh token...");

//                 const refreshResponse = await axios.post(`${BASE_URL}token/refresh/`, { refresh: refresh });
//                 console.log("Refresh response:", refreshResponse.data);
//                 if (refreshResponse.status === 200) {
//                     const newAccessToken = refreshResponse.data.access;
//                     const newRefreshToken = refreshResponse.data.refresh;

//                     localStorage.setItem('access', newAccessToken);
//                     localStorage.setItem('refresh', newRefreshToken);

//                     axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

//                     // Retry the original request with the new token
//                     return axiosInstance(originalRequest);
//                 }
//             } catch (refreshError) {
//                 console.error("Token refresh failed:", refreshError);
//                 // Optionally, redirect to login page here
//             }
//         }

//         // If it's not a 401 error or token refresh failed, reject the error
//         return Promise.reject(error);
//     }
// );
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Check if the response status is 401 (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refresh');

            if (!refresh) {
                console.error("No refresh token found in localStorage");
                // Optionally, navigate the user to the login page
                return Promise.reject(error);
            }

            try {
                console.log("Attempting to refresh token...");
                const refreshResponse = await axios.post(`${BASE_URL}token/refresh/`, { refresh });

                if (refreshResponse.status === 200) {
                    const newAccessToken = refreshResponse.data.access;
                    const newRefreshToken = refreshResponse.data.refresh;

                    // Save the new tokens
                    localStorage.setItem('access', newAccessToken);
                    localStorage.setItem('refresh', newRefreshToken);

                    // Update the Axios instance headers
                    // axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access;

                    // Retry the original request
                    originalRequest.headers['Authorization'] = 'Bearer ' + access;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Optionally, redirect to the login page here
                return Promise.reject(refreshError);
            }
        }

        // Reject all other errors
        return Promise.reject(error);
    }
);


export default axiosInstance;
