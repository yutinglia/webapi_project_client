import React from 'react'
import { Container, Grid, Box, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DogCard from '../../components/DogCard'
import axios from '../../helpers/axios'
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config"
import Swal from 'sweetalert2'
import InfiniteScroll from 'react-infinite-scroller';
import SearchBar from '../../components/SearchBar'

export default function Home() {

    const [shelters, setShelters] = React.useState([]);
    const [selectedShelter, setSelectedShelter] = React.useState(-1);

    const [favoritesDogs, setFavoritesDogs] = React.useState([]);

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
