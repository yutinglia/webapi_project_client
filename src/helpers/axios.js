import axios from 'axios'
import Cookies from 'js-cookie'
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../config"
import Swal from 'sweetalert2'

const instance = axios.create({
    baseURL: EXPRESS_SERVER_URL,
    timeout: 10000
});

// alway send token
instance.interceptors.request.use(function (config) {
    const token = Cookies.get('token');
    config.headers.Authorization = token;
    return config;
});

instance.interceptors.response.use(function (response) {
    // handle token
    const token = response.data.token || response.data.newToken;
    if (token) {
        Cookies.set("token", token, { expires: COOKIES_EXPIRES_TIME })
    }
    return response;
}, function (error) {
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
