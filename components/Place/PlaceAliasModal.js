import { LoadingButton } from "@mui/lab";
import { Backdrop, Fade, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import { useUpdatePlaceAliasMutation } from "../../Redux/services/servicesApi";

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

const PlaceAliasModal = ({
  openAliasModal,
  closeAliasModal,
  place,
  editedPlace,
}) => {
  const [updatePlaceAlias, { data, error, isSuccess, isError, isLoading }] =
    useUpdatePlaceAliasMutation();

  const [errorMsg, setErrorMsg] = useState("");
  const [alias, setAlias] = useState(place?.alias || []);
  const [name, setName] = useState("");

  useEffect(() => {
    setAlias(place?.alias);
  }, [place]);

  //SET PLACE DATA
  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }

    if (isError) {
      setErrorMsg(error?.data?.message?.general || error?.data?.message?.alias);
    }
  }, [isSuccess, isError]);

  //ADD NAME TO ALIAS ARRAY
  const addName = () => {
    if (name) {
      setAlias([...alias, name]);
      setName("");
    } else {
      setErrorMsg("Please enter a alias name");
    }
  };

  //Remove element from type
  const removeElement = (index) => {
    const newAlias = [...alias];
    newAlias.splice(index, 1);
    setAlias(newAlias);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!place?.name) return;

    if (alias?.length == 0) {
      setErrorMsg("Please add atlest 1 alias");
    } else {
      const body = {
        place_id: place._id,
        alias,
      };
      updatePlaceAlias(body);
    }
  };

  return (
    <Modal
      open={openAliasModal}
      onClose={closeAliasModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openAliasModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            {place?.alias?.length == 0 ? "Add Place Alias" : "Edit Place Alias"}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 3 }}
            className="font-bold text-lg"
          >
            Place Name : {place?.name}
          </Typography>
          <h1 className=" text-blue-800">***ADD ALIAS***</h1>

          <div className="py-5 flex justify-start space-x-3 ">
            <div className="flex-1 items-center">
              <input
                type="text"
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                placeholder="Add Alias"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg("");
                }}
              />
            </div>
            <button
              onClick={addName}
              className="bg-orange-600 px-8 py-1 rounded-lg font-bold text-white hover:bg-orange-500"
            >
              ADD
            </button>
          </div>
          {errorMsg && <p className="text-sm text-red-700 pl-2">{errorMsg}</p>}
          {place?.name && alias && (
            <div>
              {alias.map((name, index) => (
                <div
                  key={index}
                  className="pt-3 flex justify-start items-center"
                >
                  <span className="text-xl font-bold mr-2">{index}:</span>
                  <span className="bg-blue-400 py-1 px-4 text-white">
                    {name}
                  </span>
                  <button className="ml-2" onClick={() => removeElement(index)}>
                    <XCircleIcon className="h-6 w-6 text-red-700" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <LoadingButton
              disabled={alias?.length == 0}
              loading={isLoading}
              onClick={handleUpdate}
              className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
            >
              {place?.alias?.length == 0 ? "Add Alias" : "Update Alias"}
            </LoadingButton>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PlaceAliasModal;
