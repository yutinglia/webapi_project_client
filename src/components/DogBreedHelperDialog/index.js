import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { EXPRESS_SERVER_URL } from "../../config"
import axios from 'axios'
import Swal from 'sweetalert2'
import { FormControl, InputLabel, Select, MenuItem, Stack, Box } from '@mui/material'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import copy from 'copy-to-clipboard';

export default function DogDialog(props) {

    let { open, setOpen } = props;

    const [breeds, setBreeds] = React.useState([]);
    const [selectedBreed, setSelectedBreed] = React.useState(0);
    const [dogImgURL, setDogImgURL] = React.useState("");

    const getDogBreeds = async () => {
        try {
            const result = await axios(`https://dog.ceo/api/breeds/list/all`, { method: 'GET' })
            const json = result.data;
            const breeds = Object.keys(json.message)
            setBreeds(breeds);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Get Data Failed',
                text: err,
                allowOutsideClick: false
            })
        }
    }

    const getDogImgURL = async () => {
        if (breeds.length <= 0) return;
        try {
            const result = await axios(`https://dog.ceo/api/breed/${breeds[selectedBreed]}/images/random`, { method: 'GET' })
            const json = result.data;
            setDogImgURL(json.message);
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
        getDogImgURL();
    }, [breeds, selectedBreed])

    React.useEffect(() => {
        getDogBreeds();
    }, [])

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Dog Breeds</DialogTitle>
                <DialogContent>
                    <br />
                    <Stack direction="row" spacing={1}>
                        <FormControl fullWidth>
                            <InputLabel id="breedSelectLabel">Breeds</InputLabel>
                            <Select
                                labelId="breedSelectLabel"
                                id="breedSelect"
                                value={selectedBreed}
                                label="Age"
                                onChange={e => setSelectedBreed(e.target.value)}
                            >
                                {
                                    breeds.map((breed, index) => <MenuItem key={breed} value={index}>{breed}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <Button onClick={() => copy(breeds[selectedBreed])} variant="contained" startIcon={<ChangeCircleIcon />}>Copy</Button>
                    </Stack>
                    <br /><br />
                    <Stack spacing={2}>
                        <Button onClick={() => { getDogImgURL(); }} variant="contained" startIcon={<ChangeCircleIcon />}>Change Photo</Button>
                        <img alt="dog" src={dogImgURL} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
