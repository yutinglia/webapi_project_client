import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EXPRESS_SERVER_URL } from "../../config"
import axios from '../../helpers/axios'
import Swal from 'sweetalert2'
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination'
import { Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material/';
import EditIcon from '@mui/icons-material/Edit';
import DogDialog from '../DogDialog'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import DogBreedHelperDialog from '../DogBreedHelperDialog'

export default function DogsTable() {

    const [dogs, setDogs] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [limit, setLimit] = React.useState(5);
    const [total, setTotal] = React.useState(0);

    const [selectedDog, setSelectedDog] = React.useState(null);
    const [dogDialogOpen, setDogDialogOpen] = React.useState(false);
    const [dogBreedHelperDialogOpen, setDogBreedHelperDialogOpen] = React.useState(false);

    async function getDogs() {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/dogs?page=${page + 1}&limit=${limit}`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setDogs(json.dogs);
                setTotal(parseInt(json.total));
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

    const deleteDog = async (id) => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/dogs/${id}`, { method: 'DELETE' })
            const json = result.data;
            if (json.status === 0) {
                getDogs();
                return true;
            } else {
                throw new Error(json.err);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Delete Failed',
                text: err,
                allowOutsideClick: false
            })
        }
        return false;
    }

    React.useEffect(() => {
        getDogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit])

    React.useEffect(() => {
        getDogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    return (
        <>
            <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                    setSelectedDog(null);
                    setDogDialogOpen(true);
                }}
            >
                Add New Dog
            </Button>
            <Button
                startIcon={<HelpIcon />}
                variant="contained"
                onClick={() => {
                    setDogBreedHelperDialogOpen(true);
                }}
            >
                Dog Breed Selection Helper
            </Button>
            <DogDialog disableBackdropClick getDogs={getDogs} selectedDog={selectedDog} dogDialogOpen={dogDialogOpen} setDogDialogOpen={setDogDialogOpen} />
            <DogBreedHelperDialog open={dogBreedHelperDialogOpen} setOpen={setDogBreedHelperDialogOpen} />
            {/* Rows per page: */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Birthday</TableCell>
                            <TableCell align="right">Shelter</TableCell>
                            <TableCell align="right">Chip ID</TableCell>
                            <TableCell align="right">Edit</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dogs.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.type}</TableCell>
                                <TableCell align="right">{new Date(row.birthday).toLocaleDateString()}</TableCell>
                                <TableCell align="right">{row.shelter_name}</TableCell>
                                <TableCell align="right">{row.chip_id}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary"
                                        onClick={() => {
                                            setSelectedDog(row);
                                            setDogDialogOpen(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="error"
                                        onClick={() => {
                                            Swal.fire({
                                                title: `Are you sure to delete <br/>${row.name} (ID: ${row.id})?`,
                                                showCancelButton: true,
                                                confirmButtonText: 'Delete',
                                                icon: 'question',
                                                confirmButtonColor: '#dd4444'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    if (deleteDog(row.id)) {
                                                        Swal.fire(
                                                            'Deleted!',
                                                            `${row.name} (ID: ${row.id}) has been deleted.`,
                                                            'success'
                                                        )
                                                    }
                                                }
                                            })
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        {/* Pagination */}
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={5}
                                count={total}
                                rowsPerPage={limit}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={(e, page) => { setPage(page) }}
                                onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)) }}
                            />
                            <TableCell>
                                <FormControl variant="standard">
                                    <InputLabel id="pageSelectLabel">Page</InputLabel>
                                    <Select
                                        labelId="pageSelectLabel"
                                        id="pageSelect"
                                        value={page + 1}
                                        label="Page"
                                        onChange={(e) => { setPage(e.target.value - 1) }}
                                    >
                                        {
                                            [...Array(Math.ceil(total / limit)).keys()].map(page => {
                                                return <MenuItem key={page + 1} value={page + 1}>{page + 1}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
