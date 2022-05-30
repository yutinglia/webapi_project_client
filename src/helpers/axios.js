import axios from 'axios';
import Swal from 'sweetalert2';
import { EXPRESS_SERVER_URL } from "../config";


const instance = axios.create({
    baseURL: EXPRESS_SERVER_URL,
    timeout: 10000
});

// auto add token to header when send request
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token;
    return config;
});

// auto process response
instance.interceptors.response.use(function (response) {
    // if response has new token, save token
    const token = response.data.token || response.data.newToken;
    if (token) {
        localStorage.setItem("token", token)
    }
    return response;
}, function (error) {
    // auto process response error
    if (error.response.status !== 401) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error,
            allowOutsideClick: false
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Has Expired!',
            text: 'Please login again',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.replace("/login");
            }
        })
    }
    return Promise.reject(error);
});

export default instance
