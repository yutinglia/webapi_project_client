import { Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Swal from 'sweetalert2'
import DogCard from '../../components/DogCard'
import SearchBar from '../../components/SearchBar'
import { EXPRESS_SERVER_URL } from "../../config"
import UserContext from '../../contexts/user'
import axios from '../../helpers/axios'

export default function Home() {

    const { user } = React.useContext(UserContext);

    const [dogs, setDogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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

    // for infinite scroll load more data
    const loadMoreDogs = async () => {
        if (loading) return;
        setLoading(true);
        const maxPage = Math.ceil(total / limit);
        if (page < maxPage) {
            await getDogs();
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
                setPage(page => page + 1);
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
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        setPage(0);
        setDogs([]);
    }, [selectedShelter, searchText])

    React.useEffect(() => {
        setPage(0);
        setDogs([]);
        getShelters();
        if (user) getFavorites();
        // prevent loading to fast, fix a weird bug
        const timeout = setTimeout(() => {
            setLoading(false);
        })
        return (() => { clearTimeout(timeout) })
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
                hasMore={page < Math.ceil(total / limit) && !loading}
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
            <br />
        </Container>
    )
}
