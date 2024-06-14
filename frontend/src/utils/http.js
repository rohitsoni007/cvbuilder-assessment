import axios from 'axios';
export const http = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
  });

// Add a request interceptor
http.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem('token');
    token = token ?`Bearer ${token}`: null;
    config.headers.Authorization =  token;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
http.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
