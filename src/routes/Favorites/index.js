import { Container, Grid } from '@mui/material'
import React from 'react'
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import DogCard from '../../components/DogCard'
import { EXPRESS_SERVER_URL } from "../../config"
import UserContext from '../../contexts/user'
import axios from '../../helpers/axios'

export default function Home() {

    const { user } = React.useContext(UserContext);

    const [favoritesDogs, setFavoritesDogs] = React.useState([]);

    let navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user])

    const getFavorites = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/favorites`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setFavoritesDogs(json.favorites);
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
        getFavorites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <h1>Favorites:</h1>
            <br /><br />
            <Grid container spacing={2}>
                {favoritesDogs.map((dog, i) => {
                    return (
                        <Grid key={i} item xs>
                            <DogCard dog={dog} favorites={favoritesDogs} getFavorites={getFavorites} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}
