import React from 'react'
import { Container, Paper, Stack, Typography, TextField, Button, Grid } from '@mui/material'
import { useNavigate } from "react-router-dom";
import DogsTable from '../../components/DogsTable'

export default function DogeManagement() {
    let navigate = useNavigate();

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
