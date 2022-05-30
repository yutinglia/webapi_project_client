import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { EXPRESS_SERVER_URL } from "../../config";
import UserContext from '../../contexts/user';
import axios from '../../helpers/axios';

export default function SheltersPage() {

    const { user } = React.useContext(UserContext);

    const [shelters, setShelters] = React.useState([]);
    const [shelterNameInput, setShelterNameInput] = React.useState("");
    const [shelterAddressInput, setShelterAddressInput] = React.useState("");

    let navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user])

    async function getShelters() {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/shelters`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setShelters(json.shelters);
            } else {
                throw new Error(json.err);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Get Data Failed',
                text: err,
                allowOutsideClick: false
            })
        }
    }

    async function addShelter() {
        if (shelterNameInput.length <= 0 || shelterAddressInput.length <= 0) return;

        const result = await axios(`${EXPRESS_SERVER_URL}/shelters`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ name: shelterNameInput, address: shelterAddressInput })
        })

        const json = result.data;

        setShelterNameInput("");
        setShelterAddressInput("");

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        getShelters();
    }

    React.useEffect(() => {
        getShelters();
    }, [])

    return (
        <Container maxWidth="md">
            <br />
            <Paper sx={{ textAlign: 'center', padding: '10px' }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={shelterNameInput}
                        onChange={e => setShelterNameInput(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Address"
                        variant="outlined"
                        value={shelterAddressInput}
                        onChange={e => setShelterAddressInput(e.target.value)}
                    />
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => {
                            addShelter();
                        }}
                    >
                        Add
                    </Button>
                </Stack>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shelters.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.id}</TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">{row.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}
