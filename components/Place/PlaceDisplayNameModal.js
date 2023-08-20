import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useChangePlaceNameMutation } from "../../Redux/services/servicesApi";

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

const PlaceDisplayNameModal = ({
  openDisplayNameModal,
  closeDisplayNameModal,
  place,
  editedPlace,
}) => {
  const [changePlaceName, { data, error, isLoading, isSuccess, isError }] =
    useChangePlaceNameMutation();
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }
    if (isError) {
      setErrorMsg(error?.data?.message?.general || error?.data?.message?.name);
    }
  }, [isSuccess, isError]);

  const handleDisplayUpdateNameAction = () => {
    if (!displayName.trim()) {
      setErrorMsg("Please enter a name");
    } else {
      const body = {
        name: displayName.trim(),
        type: "display_name",
        place_id: place._id,
      };

      changePlaceName(body);
    }
  };

  return (
    <Modal
      open={openDisplayNameModal}
      onClose={closeDisplayNameModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openDisplayNameModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Edit Dispalay Name
          </Typography>
          <div>
            <TextField
              error={errorMsg ? true : false}
              helperText={errorMsg}
              required
              id="outlined-required"
              label="Place Display Name"
              defaultValue={place?.display_name}
              onChange={(e) => {
                setErrorMsg("");
                setDisplayName(e.target.value);
              }}
              className="w-full mt-4"
            />
          </div>

          <div className="mt-4">
            <LoadingButton
              loading={isLoading}
              onClick={handleDisplayUpdateNameAction}
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

export default PlaceDisplayNameModal;
