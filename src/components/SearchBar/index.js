import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Paper } from '@mui/material'

export default function SearchBar(props) {
    const { onSearchClick } = props;
    const [text, setText] = React.useState("");

    return (
        <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search By Name/Type/Chip ID"
                inputProps={{ 'aria-label': 'search by name/type/chip id' }}
                onChange={e => setText(e.target.value)}
                value={text}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => { onSearchClick(text) }}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
