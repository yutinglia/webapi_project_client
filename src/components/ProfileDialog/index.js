import { blue } from '@mui/material/colors';
import { Card, CardContent, Divider, Box, Stack } from '@mui/material/'
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import UserContext from '../../contexts/user';
import GoogleSignIn from '../GoogleSignIn';
import Swal from 'sweetalert2'
import { EXPRESS_SERVER_URL } from '../../config'
import axios from '../../helpers/axios'

export default function ProfileDialog(props) {
    const { onClose, open } = props;
    const { user, setUser } = React.useContext(UserContext);
    const [googleInfo, setGoogleInfo] = React.useState({});

    const handleClose = () => {
        onClose();
    };

    React.useEffect(() => {
        getGoogleInfo();
    }, [user])

    const getGoogleInfo = async () => {
        if (!user) return;
        const result = await axios(`${EXPRESS_SERVER_URL}/users/self/google`, { method: 'GET' })
        const json = result.data;
        setGoogleInfo(json.google);
    }

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

        const result = await axios(`${EXPRESS_SERVER_URL}/users/self/google`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ token: res.credential })
        })

        const json = result.data;

        if (json.status !== 0) {
            onClose();
            Swal.fire({
                title: 'Error!',
                text: json.err,
                icon: 'error',
                allowOutsideClick: false
            })
            return;
        }

        getGoogleInfo();
    }

    return (
        <Dialog open={open} >
            <DialogTitle>Profile</DialogTitle>
            <Card sx={{ width: '50vh' }}>
                <CardContent>
                    <Avatar sx={{ margin: 'auto' }} /><br />
                    <Divider light /><br />
                    <Stack >
                        <Box>ID: {user ? user.id : ""}</Box>
                        <Box>Username: {user ? user.username : ""}</Box><br />
                        Connect With Google:<br />
                        {googleInfo && googleInfo.id && googleInfo.email ?
                            "Connected to email: " + googleInfo.email
                            :
                            <GoogleSignIn callback={handleGoogleCallback} />
                        }
                        <Divider light /><br />
                        <Button onClick={handleClose}>Close</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Dialog>
    );
}