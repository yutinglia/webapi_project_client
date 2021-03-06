import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import Swal from 'sweetalert2';
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../helpers/axios';

const ITEM_HEIGHT = 48;

export default function MessageMenu(props) {
    const { id, updateMessages, socket } = props;

    const deleteMessage = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/messages/${id}`, { method: 'DELETE' })
            const json = result.data;
            if (json.status === 0) {
                updateMessages();
                socket.emit('c-updated-message');
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

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteClick = () => {
        handleClose();
        deleteMessage();
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem key={"Delete"} onClick={handleDeleteClick}>
                    {"Delete"}
                </MenuItem>
            </Menu>
        </div>
    );
}
