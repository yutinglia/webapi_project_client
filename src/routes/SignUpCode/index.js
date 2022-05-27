import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config"
import axios from '../../helpers/axios'
import Swal from 'sweetalert2'
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination'
import { Button, FormControl, InputLabel, Select, MenuItem, IconButton, Container, Stack, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SignUpCodePage() {

    const [codes, setCodes] = React.useState([]);
    const [codeInput, setCodeInput] = React.useState("");

    async function getCode() {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/sign-up-code`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setCodes(json.codes);
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

    async function addCode() {
        if (codeInput.length <= 0) return;

        const result = await axios(`${EXPRESS_SERVER_URL}/sign-up-code`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ code: codeInput })
        })

        const json = result.data;

        setCodeInput("");

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        getCode();
    }

    React.useEffect(() => {
        getCode();
    }, [])

    return (
        <Container maxWidth="md">
            <br />
            <Paper sx={{ textAlign: 'center', padding: '10px' }}>
                <Stack direction="row" spacing={2}>
                    <TextField id="outlined-basic" label="Code" variant="outlined" value={codeInput} onChange={e => setCodeInput(e.target.value)} />
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => {
                            addCode();
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
                                <TableCell align="right">Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {codes.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.id}</TableCell>
                                    <TableCell align="right">{row.code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}
