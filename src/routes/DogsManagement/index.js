import React from 'react'
import { Container, Paper, Stack, Typography, TextField, Button, Grid } from '@mui/material'
import DogsTable from '../../components/DogsTable'
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/user';

export default function DogeManagement() {

    const { user } = React.useContext(UserContext);

    let navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user])

    return (
        <Container maxWidth="md">
            <br />
            <Paper sx={{ textAlign: 'center', padding: '10px' }}>
                <Stack spacing={1}>
                    <h1>Dogs Management</h1>
                    <DogsTable />
                </Stack>
            </Paper>
            <br />
        </Container>
    )
}
