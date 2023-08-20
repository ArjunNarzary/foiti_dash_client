import { LoadingButton } from "@mui/lab";
import { Backdrop, Fade, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useUpdateEditorRatingMutation } from "../../Redux/services/servicesApi";

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

const AddEditorRatingModal = ({
  openEditorRatingModal,
  closeEditorRatingModal,
  place,
  editedPlace,
}) => {
  const [updateEditorRating, { data, error, isSuccess, isError, isLoading }] =
    useUpdateEditorRatingMutation();
  const [rating, setRating] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //SET PLACE DATA
  useEffect(() => {
    if (isSuccess) {
      setRating("");
      editedPlace(data?.place);
    }

    if (isError) {
      setErrorMsg(error?.data?.message?.rank || error?.data?.message?.general);
    }
  }, [isSuccess, isError]);

  const handleUpdateEditorRating = (e) => {
    e.preventDefault();
    if (!place?.name) return;

    if (rating.trim() == "") {
      setErrorMsg("Please enter rating");
    } else if (Number.isNaN(Number(rating))) {
      setErrorMsg("Please enter valid rating");
    } else {
      const body = {
        place_id: place._id,
        rating,
      };
      updateEditorRating(body);
    }
  };

  return (
    <Modal
      open={openEditorRatingModal}
      onClose={closeEditorRatingModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openEditorRatingModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Edit Search Rank
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
              error={errorMsg ? true : false}
              helperText={errorMsg}
              required
              id="outlined-required"
              label="Search Rank"
              defaultValue={place?.editor_rating}
              onChange={(e) => {
                setErrorMsg("");
                setRating(e.target.value);
              }}
              className="w-full mt-4"
            />
          </div>

          <div className="mt-4">
            <LoadingButton
              loading={isLoading}
              onClick={handleUpdateEditorRating}
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

export default AddEditorRatingModal;
