import { LoadingButton } from "@mui/lab";
import { Backdrop, Fade, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useUpdatePlaceCoorsMutation } from "../../Redux/services/servicesApi";

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
  height: "auto%",
  pb: 15,
};

const PlaceCoordinatesModal = ({
  openCoorModal,
  closeCoorModal,
  place,
  editedPlace,
}) => {
  const [updatePlaceCoors, { data, error, isSuccess, isError, isLoading }] =
    useUpdatePlaceCoorsMutation();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [errorMsg, setErrorMsg] = useState({});

  //SET PLACE DATA
  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }

    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  }, [isSuccess, isError]);

  const handleUpdateCoorAction = (e) => {
    e.preventDefault();
    if (!place?.name) return;

    if (lat == "") {
      setErrorMsg({ lat: "Please enter valid latitude" });
    } else if (lng == "") {
      setErrorMsg({ lng: "Please enter valid longitude" });
    } else {
      const body = {
        place_id: place._id,
        lat,
        lng,
      };
      updatePlaceCoors(body);
    }
  };

  return (
    <Modal
      open={openCoorModal}
      onClose={closeCoorModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openCoorModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Edit Coordinates
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 3 }}
            className="font-bold"
          >
            Place Name : {place?.name}
          </Typography>
          <div>
            <TextField
              error={errorMsg?.lat ? true : false}
              helperText={errorMsg.lat}
              required
              id="outlined-required"
              label="Latitude"
              defaultValue={place?.coordinates?.lat}
              onChange={(e) => {
                setErrorMsg({ ...errorMsg, lat: "" });
                setLat(e.target.value);
              }}
              className="w-full mt-4"
            />

            <TextField
              error={errorMsg?.lng || errorMsg?.general ? true : false}
              helperText={errorMsg?.lng || errorMsg?.general}
              required
              id="outlined-required"
              label="Longitute"
              defaultValue={place?.coordinates?.lng}
              onChange={(e) => {
                setErrorMsg({ ...errorMsg, lng: "" });
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
              Update
            </LoadingButton>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PlaceCoordinatesModal;
