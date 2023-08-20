import React, { useEffect } from 'react'
import { Backdrop, Box, Fade, Modal, TextField, Typography } from '@mui/material';
import { RiMap2Line } from "react-icons/ri";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useUpdateCoordinateMutation } from '../../Redux/services/servicesApi';
import { useDispatch } from 'react-redux';
import { resetServerRequest } from '../../Redux/slices/serverRequestSlice';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "rgba(255, 255, 240, 0.9)",
    overflowY: "scroll",
    boxShadow: 24,
    p: 4,
    zIndex: 20,
    pb: 15,
};
const coors = {
    height: "100%",
};

const UpdateCoordinatesComponent = ({ post, updateSelectedPost }) => {
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState("");
    const [openCoorModal, setOpenCoorModal] = useState(false);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    //Update Coordinates
    const [
        updateCoordinate,
        {
            data,
            error,
            isSuccess,
            isError,
            isLoading,
        },
    ] = useUpdateCoordinateMutation();

    useEffect(() => {
        if (isSuccess) {
            setOpenCoorModal(false);
            setLat("");
            setLng("");
            dispatch(resetServerRequest())
            updateSelectedPost(data.post)
        }

        if (isError) {
            setErrorMsg({
                lng:
                    error?.data?.message?.lng ||
                    error?.data?.message?.general,
                lat: error?.data?.message?.lat,
            });
        }
    }, [isSuccess, isError]);

    const handleUpdateCoorAction = (e) => {
        e.preventDefault();
        if (lat == "") {
            setErrorMsg({ lat: "Please enter valid latitude" });
        } else if (lng == "") {
            setErrorMsg({ lng: "Please enter valid longitude" });
        } else {
            const body = {
                post_id: post._id,
                lat,
                lng,
            };
            updateCoordinate(body);
        }
    };

    return (
        <>
            <div className='mb-2'>
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='flex justify-start items-center gap-1'>
                            <span>
                                Coordinates:{" "}
                            </span>
                            <button onClick={() => setOpenCoorModal(open => !open)}>
                                <SettingsIcon size={15} className="text-[1.1rem]" />
                            </button>
                        </div>
                    </div>
                    {post?.content && post?.content.length > 0 && post?.content[0]?.location && <div>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${post?.content[0]?.location?.coordinates[1]},${post?.content[0]?.location?.coordinates[0]}`}>
                            <div className='flex justify-end items-center gap-1'>
                                <span>View Map</span>
                                <RiMap2Line />
                            </div>
                        </a>
                    </div>}
                </div>
                {
                    post?.content && post?.content.length > 0 && post?.content[0]?.location && 
                    (<div>
                        <h3 className='text-md font-bold mb-2 mt-2'>Latitude: {post?.content[0]?.location?.coordinates[1]}</h3>
                        <h3 className='text-md font-bold'>Longitude: {post?.content[0]?.location?.coordinates[0]}</h3>
                    </div>)
                }
            </div>

            {/* MODAL FOR ADDING?EDITING COORDINATES */}
            <Modal
                open={openCoorModal}
                onClose={() => {
                    setOpenCoorModal(false);
                    setErrorMsg({});
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openCoorModal}>
                    <Box sx={[style, coors]}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            className="text-center"
                        >
                            {post?.coordinate_status ? "Edit" : "Add"} Coordinates
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            sx={{ mt: 3 }}
                            className="font-bold"
                        >
                            Place Name : {post?.place?.name}
                        </Typography>
                        <div>
                            <TextField
                                error={errorMsg?.lat ? true : false}
                                helperText={errorMsg.lat}
                                required
                                id="outlined-required"
                                label="Latitude"
                                defaultValue={
                                    post.name ? post?.content[0]?.location?.coordinates[1] : ""
                                }
                                onChange={(e) => {
                                    setErrorMsg("");
                                    setLat(e.target.value);
                                }}
                                className="w-full mt-4"
                            />

                            <TextField
                                error={errorMsg?.lng ? true : false}
                                helperText={errorMsg.lng}
                                required
                                id="outlined-required"
                                label="Longitute"
                                defaultValue={
                                    post.name ? post?.content[0]?.location?.coordinates[0] : ""
                                }
                                onChange={(e) => {
                                    setErrorMsg("");
                                    setLng(e.target.value);
                                }}
                                className="w-full mt-4"
                            />
                        </div>

                        <div className="mt-4">
                            <LoadingButton
                                loading={isLoading}
                                onClick={handleUpdateCoorAction}
                                className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
                            >
                                {post?.coordinate_status ? "Edit" : "Save"}
                            </LoadingButton>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default UpdateCoordinatesComponent