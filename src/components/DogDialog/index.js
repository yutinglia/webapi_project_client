import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import * as React from 'react';
import Swal from 'sweetalert2';
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../helpers/axios';
import ImageDropzone from '../ImageDropzone';

// for edit or add dog
export default function DogDialog(props) {

    let { selectedDog, dogDialogOpen, setDogDialogOpen, disableBackdropClick, getDogs } = props;
    const { name, type, birthday, chip_id, id, shelter_id } = selectedDog || {};

    const [date, setDate] = React.useState(moment());
    const [shelters, setShelters] = React.useState([]);
    const [selectedShelter, setSelectedShelter] = React.useState(1);

    const [image, setImage] = React.useState([]);

    const getShelters = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/shelters`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setShelters(json.shelters);
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

    React.useEffect(() => {
        getShelters();
    }, [])

    React.useEffect(() => {
        let date = birthday || undefined;
        let sid = shelter_id || 1;
        setDate(moment(date));
        setSelectedShelter(sid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDog])

    const handleClose = (event, reason) => {
        if (disableBackdropClick && reason && reason === "backdropClick") {
            return;
        }
        setDogDialogOpen(false);
        setImage([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append("birthday", date.format("YYYY-MM-DD"))
        data.append("shelter", selectedShelter)
        data.append("image", image[0])

        setDogDialogOpen(false);

        const method = selectedDog ? "PUT" : "POST";

        const result = await axios(`${EXPRESS_SERVER_URL}/dogs${selectedDog ? `/${id}` : ""}`, {
            method: method,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: data
        })

        const json = result.data;

        // console.log(json);

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Add Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        } else {
            Swal.fire({
                icon: 'success',
                title: `${selectedDog ? "Edit" : "Add"} Dog Success`,
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    getDogs();
                }
            })
        }

        setImage([]);

    }

    return (
        <div>
            <Dialog fullWidth open={dogDialogOpen} onClose={handleClose}>
                <DialogTitle>{selectedDog ? `Edit Dog Information(Dog ID: ${id})` : "Add New Dog Information"}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} enctype="multipart/form-data">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            name="name"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                            defaultValue={name || ""}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="type"
                            label="Type"
                            name="type"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                            defaultValue={type || ""}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="chip"
                            name="chip_id"
                            label="Chip ID"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                            defaultValue={chip_id || ""}
                        />
                        <br /><br />
                        <FormControl fullWidth>
                            <InputLabel id="selectShelterLbl">Shelter</InputLabel>
                            <Select
                                labelId="selectShelterLbl"
                                id="selectShelter"
                                value={selectedShelter}
                                label="Shelter"
                                onChange={(e) => setSelectedShelter(e.target.value)}
                            >
                                {shelters.map(shelter => <MenuItem key={shelter.id} value={shelter.id}>{`${shelter.name} (Address: ${shelter.address})`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <br /><br />
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Birthday"
                                value={date}
                                maxDate={moment()}
                                onChange={(newValue) => {
                                    setDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <br /><br />

                        Photo:<br />
                        <ImageDropzone selectedDog={selectedDog} files={image} setFiles={setImage} />

                        <br />

                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="contained">{selectedDog ? "Edit" : "Add"}</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
