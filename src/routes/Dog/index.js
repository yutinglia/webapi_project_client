import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, IconButton, Container, Grid } from '@mui/material';
import { EXPRESS_SERVER_URL } from "../../config"
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from '../../helpers/axios'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/user';
import { useParams } from "react-router-dom";

export default function Dog() {
    const [favorites, setFavorites] = React.useState([]);
    const [dog, setDog] = React.useState({});
    const [inFavorites, setInFavorites] = React.useState(false);

    const { user } = React.useContext(UserContext);

    let { id } = useParams();

    let navigate = useNavigate();

    React.useEffect(() => {
        getDog();
        if (user) getFavorites();
    }, [])

    const getDog = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/dogs/${id}`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setDog(json.dog);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Get Data Failed',
                    text: json.err,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/');
                    }
                })
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
        setInFavorites(favorites.some(favorite => favorite.dog === dog.id));
    }, [dog, favorites])

    const getFavorites = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/favorites`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setFavorites(json.favorites);
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

    const editFavorites = async () => {
        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Login required',
                showCancelButton: true,
                confirmButtonText: 'Login',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    navigate('/login');
                }
            })
            return;
        }

        const result = await axios(`${EXPRESS_SERVER_URL}/favorites${inFavorites ? `/${dog.id}` : ""}`, {
            method: inFavorites ? 'DELETE' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: inFavorites ? undefined : JSON.stringify({ dogID: dog.id })
        })

        const json = result.data;

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        getFavorites();
    }

    return (
        <>
            <br />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Card >
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            src={dog.img ? `${EXPRESS_SERVER_URL}/images/dogs/${dog.img}` : "/dog.png"}
                            alt="dog"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {dog.name}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                ID: {dog.id}<br />
                                Type: {dog.type}<br />
                                Birthday: {new Date(dog.birthday).toLocaleDateString()}<br />
                                Shelter: {dog.shelter_name}<br />
                                Shelter Address: {dog.shelter_address}<br />
                                Chip ID: {dog.chip_id}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <IconButton aria-label="add to favorites" onClick={editFavorites}>
                            <FavoriteIcon sx={{ color: inFavorites ? 'red' : 'gray' }} />
                        </IconButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    );
}
