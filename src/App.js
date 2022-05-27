import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import UserContext from './contexts/user';
import * as React from 'react';
import axios from './helpers/axios';
import { EXPRESS_SERVER_URL } from "./config"
import Cookies from 'js-cookie'
import Navbar from './components/Navbar'
import Swal from 'sweetalert2'

import HomePage from './routes/Home'
import NotFoundPage from './routes/NotFound';
import LoginPage from './routes/Login'
import RegisterPage from './routes/Register'
import DogsManagementPage from './routes/DogsManagement';
import FavoritesPage from './routes/Favorites'
import DogDetailPage from './routes/Dog';
import MessagesPage from './routes/Messages'
import SignUpCodePage from './routes/SignUpCode'

function App() {

    const [user, setUser] = React.useState(null);

    function logout() {
        Swal.fire({
            title: 'Are you sure?',
            text: "Logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('token');
                setUser(null);
            }
        })
    }

    // for navbar
    const pages = [
        { name: 'Home', link: '/' },
        user && (user.type <= 1) ? { name: 'Dogs Management', link: '/dogs' } : null,
        user && (user.type <= 0) ? { name: 'Sign Up Code', link: '/sign-up-code' } : null,
        user && (user.type <= 2) ? { name: 'Favorites', link: '/favorites' } : null,
        user && (user.type <= 2) ? { name: 'Messages', link: '/messages' } : null,
    ];
    const settings = [
        // login
        user ? { name: 'Logout', link: '/logout', onClick: logout } : null,
        // not login
        user ? null : { name: 'Register', link: '/register' },
        user ? null : { name: 'Login', link: '/login' },
    ];

    React.useEffect(() => {
        // try get login user info on open page
        async function getSelfInfo() {
            try {
                const result = await axios(`${EXPRESS_SERVER_URL}/users/self`, { method: 'GET' })
                const json = result.data;
                if (json.status === 0) {
                    setUser(json.user);
                } else {
                    Cookies.remove('token');
                }
            } catch (err) {
                Cookies.remove('token');
            }
        }
        if (Cookies.get('token')) {
            getSelfInfo();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <BrowserRouter>
                <Navbar pages={pages} settings={settings} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dogs" element={<DogsManagementPage />} />
                    <Route path="/dogs/:id" element={<DogDetailPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/sign-up-code" element={<SignUpCodePage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
            <Outlet />
        </UserContext.Provider>
    );
}

export default App;
