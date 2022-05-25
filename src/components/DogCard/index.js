import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, IconButton } from '@mui/material';
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config"
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from '../../helpers/axios'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/user';

export default function DogCard(props) {
    const { dog, favorites, getFavorites } = props;
    const [inFavorites, setInFavorites] = React.useState(false);

    const { user } = React.useContext(UserContext);

    let navigate = useNavigate();

    React.useEffect(() => {
        setInFavorites(favorites.some(favorite => favorite.dog === dog.id));
    }, [dog, favorites])

    const mainClick = () => {
        navigate(`/dogs/${dog.id}`);
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
        <Card sx={{ minWidth: "200px", maxWidth: "300px" }}>
            <CardActionArea onClick={mainClick}>
                <CardMedia
                    component="img"
                    height="150"
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
    );
}
