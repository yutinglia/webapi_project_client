import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import PetsIcon from '@mui/icons-material/Pets';
import Swal from 'sweetalert2'

import { EXPRESS_SERVER_URL } from "./config"
import axios from './helpers/axios';
import DogDetailPage from './routes/Dog';
import DogsManagementPage from './routes/DogsManagement';
import FavoritesPage from './routes/Favorites'
import HomePage from './routes/Home'
import LoginPage from './routes/Login'
import MessagesPage from './routes/Messages'
import Navbar from './components/Navbar'
import NotFoundPage from './routes/NotFound';
import RegisterPage from './routes/Register'
import SignUpCodePage from './routes/SignUpCode'
import UserContext from './contexts/user';
import HomeIcon from '@mui/icons-material/Home';
import SheltersPage from './routes/Shelters'
import LocationCityIcon from '@mui/icons-material/LocationCity';

import ProfileDialog from './components/ProfileDialog'

function App() {

    const [user, setUser] = React.useState(null);

    const [openProfile, setOpenProfile] = React.useState(false);

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
                localStorage.removeItem('token');
                setUser(null);
            }
        })
    }

    // for navbar
    const pages = [
        { name: 'Home', link: '/', icon: <HomeIcon /> },
        user && (user.type <= 1) ? { name: 'Dogs Management', link: '/dogs', icon: <PetsIcon /> } : null,
        user && (user.type <= 0) ? { name: 'Sign Up Code', link: '/sign-up-code', icon: <KeyIcon /> } : null,
        user && (user.type <= 0) ? { name: 'Shelters', link: '/shelters', icon: <LocationCityIcon /> } : null,
        user && (user.type === 2) ? { name: 'Favorites', link: '/favorites', icon: <FavoriteIcon /> } : null,
        user && (user.type <= 2) ? { name: 'Messages', link: '/messages', icon: <MessageIcon /> } : null,
    ];
    const settings = [
        // login
        user ? { name: 'Profile', link: '/profile', onClick: () => { setOpenProfile(true) }, icon: <AccountCircleIcon /> } : null,
        user ? { name: 'Logout', link: '/logout', onClick: logout, icon: <LogoutIcon /> } : null,
        // not login
        user ? null : { name: 'Register', link: '/register', icon: <AppRegistrationIcon /> },
        user ? null : { name: 'Login', link: '/login', icon: <LoginIcon /> },
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
                    localStorage.removeItem('token');
                }
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
        if (localStorage.getItem('token')) {
            getSelfInfo();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <BrowserRouter>
                <ProfileDialog open={openProfile} onClose={() => { setOpenProfile(false) }} />
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
                    <Route path="/shelters" element={<SheltersPage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
            <Outlet />
        </UserContext.Provider>
    );
}

export default App;
