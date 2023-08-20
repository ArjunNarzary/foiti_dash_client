import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Checkbox,
  Fade,
  FormControlLabel,
  FormGroup,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAddTypeMutation,
  useEditTypeMutation,
} from "../../Redux/services/servicesApi";

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

const UpdateTypeModal = ({
  openUpdateTypeModal,
  closeUpdateTypeModal,
  typeData = {},
  updatedType,
  addedType,
}) => {
  const [addType, { data, error, isLoading, isSuccess, isError }] =
    useAddTypeMutation();
  const [
    editType,
    {
      data: editData,
      error: editError,
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
    },
  ] = useEditTypeMutation();

  const [displayType, setDisplayType] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});

  useEffect(() => {
    if (isSuccess) {
      addedType(data?.newType);
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (editIsSuccess) {
      updatedType(editData?.getType);
    }
    if (editIsError) {
      setErrorMsg(editError?.data?.message);
    }
  }, [editIsSuccess, editIsError]);

  const handleSubmit = () => {
    if (!displayType.trim()) {
      setErrorMsg({ display_type: "Please enter display type" });
    } else if (!type.trim()) {
      setErrorMsg({ type: "Please enter type" });
    } else if (!/^\S*$/.test(type)) {
      setErrorMsg({
        type: "Type cannot have spaces",
      });
    } else {
      const body = {
        display_type: displayType.trim(),
        type: type.trim(),
        type_id: typeData?._id,
        category
      };

      if (typeData?._id) {
        editType(body);
      } else {
        addType(body);
      }
    }
  };

  return (
    <Modal
      open={openUpdateTypeModal}
      onClose={closeUpdateTypeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openUpdateTypeModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            {typeData?._id ? "Edit Type" : "Add Type"}
          </Typography>
          <div>
            <TextField
              error={errorMsg.display_type ? true : false}
              helperText={errorMsg.display_type}
              required
              id="outlined-required"
              label="Display Type"
              defaultValue={typeData?.display_type}
              onChange={(e) => {
                setErrorMsg({ ...errorMsg, display_type: "" });
                setDisplayType(e.target.value);
              }}
              className="w-full mt-4"
            />
          </div>
          <div>
            <TextField
              error={errorMsg.type || errorMsg.general ? true : false}
              helperText={errorMsg.type || errorMsg.general}
              required
              id="outlined-required"
              label="Type"
              defaultValue={typeData?.type}
              onChange={(e) => {
                setErrorMsg({ ...errorMsg, type: "", general: "" });
                setType(e.target.value);
              }}
              className="w-full mt-4"
            />
          </div>
          <div>
            {/* <Checkbox label="Category" size="medium" /> */}
            <FormGroup>
              <FormControlLabel onChange={(e) => setCategory(e.target.checked)} control={<Checkbox defaultChecked={typeData?.category ? true : false} size="medium" />} label="Category" />
            </FormGroup>
          </div>

          <div className="mt-4">
            <LoadingButton
              loading={isLoading || editIsLoading}
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
            >
              {typeData?._id ? "Update" : "Add Type"}
            </LoadingButton>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UpdateTypeModal;
