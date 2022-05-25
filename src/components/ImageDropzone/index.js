import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Stack, Container } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config"

const imgStyle = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

export default function ImageDropzone(props) {
    // const [files, setFiles] = useState([]);

    const { files, setFiles, selectedDog } = props;

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => (
        <Box sx={{ width: "200px" }} key={file.name}>
            <Stack>
                <img
                    src={file.preview}
                    style={imgStyle}
                    alt="Dog"
                    // Revoke data uri after image is loaded
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => { setFiles(files => files.filter(f => f.name !== file.name)) }}
                >
                    Delete
                </Button>
            </Stack>
        </Box>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <Box
            sx={{
                borderRadius: 2,
                border: '1px solid #eaeaea',
                padding: 1,
                boxSizing: 'border-box',
                textAlign: 'center'
            }}
        >
            <Box {...getRootProps({ className: 'dropzone' })} sx={{
                borderRadius: 2,
                border: '1px solid #eaeaea',
                padding: 4,
                boxSizing: 'border-box',
                textAlign: 'center'
            }}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </Box>
            <Stack direction="row" sx={{ overflow: 'auto' }}>
                {
                    selectedDog && selectedDog.img && files.length <= 0 ?
                        <img style={{ width: "200px" }} alt="Dog" src={`${EXPRESS_SERVER_URL}/images/dogs/${selectedDog.img}`} />
                        :
                        thumbs
                }
            </Stack>
        </Box>
    );
}