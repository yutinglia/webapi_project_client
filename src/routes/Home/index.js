import React from 'react'
import { Container, Grid, Box, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DogCard from '../../components/DogCard'
import axios from '../../helpers/axios'
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config"
import Swal from 'sweetalert2'
import InfiniteScroll from 'react-infinite-scroller';
import SearchBar from '../../components/SearchBar'
import UserContext from '../../contexts/user';

export default function Home() {

    const { user } = React.useContext(UserContext);

    const [dogs, setDogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const [limit, setLimit] = React.useState(5);
    const [total, setTotal] = React.useState(1);

    const [shelters, setShelters] = React.useState([]);
    const [selectedShelter, setSelectedShelter] = React.useState(-1);

    const [searchText, setSearchText] = React.useState("");

    const [favorites, setFavorites] = React.useState([]);

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

    const loadMoreDogs = async () => {
        if (loading) return;
        setLoading(true);
        const maxPage = Math.ceil(total / limit);
        if (page < maxPage) {
            await getDogs();
            setPage(page => page + 1);
            setLoading(false);
        }
    }

    async function getDogs() {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/dogs`, {
                method: 'GET',
                params: {
                    page: page + 1,
                    limit: limit,
                    search: searchText.length > 0 ? searchText : undefined,
                    shelter: selectedShelter > 0 ? selectedShelter : undefined
                }
            })
            const json = result.data;
            if (json.status === 0) {
                if (page === 0) {
                    setDogs(json.dogs);
                } else {
                    setDogs(dogs => [...dogs, ...json.dogs]);
                }
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

    React.useEffect(() => {
        setPage(0);
        setDogs([]);
    }, [selectedShelter, searchText])

    React.useEffect(() => {
        setDogs([]);
        getShelters();
        if (user) getFavorites();
        // getDogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <br />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <SearchBar onSearchClick={setSearchText} />
                <FormControl>
                    <InputLabel id="selectShelterLbl">Shelter</InputLabel>
                    <Select
                        labelId="selectShelterLbl"
                        id="selectShelter"
                        value={selectedShelter}
                        label="Shelter"
                        autoWidth
                        onChange={(e) => setSelectedShelter(e.target.value)}
                    >
                        <MenuItem key={-1} value={-1}>All</MenuItem>
                        {shelters.map(shelter => <MenuItem key={shelter.id} value={shelter.id}>{`${shelter.name} ( Address: ${shelter.address} )`}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
            <br />
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMoreDogs}
                hasMore={page < Math.ceil(total / limit)}
                loader={<h1 className="loader" key={0}>Loading ...</h1>}
            >
                <Grid container spacing={2}>
                    {dogs.map((dog, i) => {
                        return (
                            <Grid key={i} item xs>
                                <DogCard dog={dog} favorites={favorites} getFavorites={getFavorites} />
                            </Grid>
                        )
                    })}
                </Grid>
            </InfiniteScroll>
        </Container>
    )
}
