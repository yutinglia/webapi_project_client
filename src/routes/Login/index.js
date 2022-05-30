import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import GoogleSignIn from '../../components/GoogleSignIn';
import { EXPRESS_SERVER_URL } from "../../config";
import UserContext from '../../contexts/user';
import axios from '../../helpers/axios';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Lai Yu Ting
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function LoginPage() {

    const { user, setUser } = React.useContext(UserContext);
    let navigate = useNavigate();

    React.useEffect(() => {
        // if user is logged
        if (user) {
            navigate('/');
        }
    }, [user])

    // receive google token and send to the backend
    const handleGoogleCallback = async (res, err) => {
        if (err) {
            Swal.fire({
                title: 'Error!',
                text: err,
                icon: 'error',
                allowOutsideClick: false
            })
            return;
        }

        const token = res.credential;

        const result = await axios(`${EXPRESS_SERVER_URL}/login/google`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ googleToken: token })
        })

        const json = result.data;

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Login Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        setUser(json.user);
    }

    // login with account password
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username')
        const password = data.get('password')

        const result = await axios(`${EXPRESS_SERVER_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ ac: username, pw: password })
        })

        const json = result.data;

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Login Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        // token will auto process in axios instance

        setUser(json.user);

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            required
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                        />
                        <br /><br />
                        <GoogleSignIn callback={handleGoogleCallback} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link variant="body2" onClick={() => navigate('/register')} component="button">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}