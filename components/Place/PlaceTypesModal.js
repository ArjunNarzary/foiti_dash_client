import { LoadingButton } from "@mui/lab";
import { Backdrop, Fade, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import { useUpdatePlaceTypeMutation } from "../../Redux/services/servicesApi";
import Select from "react-select";

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

const PlaceTypesModal = ({
  openTypeModal,
  closeTypeModal,
  place,
  editedPlace,
  typeArray,
}) => {
  const [updatePlaceType, { data, error, isSuccess, isError, isLoading }] =
    useUpdatePlaceTypeMutation();

  const [errorMsg, setErrorMsg] = useState("");
  const [types, setTypes] = useState(place?.types || []);
  // const [element, setElement] = useState("");
  // const [typeData, setTypeData] = useState([]);

  const options = typeArray.map((item) => {
    return { value: item.type, label: item.display_type };
  });

  const catOptions = typeArray.filter(item => item?.category).map(item => ({ value: item.type, label: item.display_type }));

  useEffect(() => {
    setTypes(place?.types);
  }, [place]);

  //SET PLACE DATA
  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }

    if (isError) {
      setErrorMsg(error?.data?.message.general || error?.data?.message?.type);
    }
  }, [isSuccess, isError]);

  //Remove element from type
  const removeElement = (index) => {
    const newTypes = [...types];
    newTypes.splice(index, 1);
    setTypes(newTypes);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!place?.name) return;

    if (types?.length == 0) {
      setErrorMsg("Please add atlest 1 type");
    } else {
      const body = {
        place_id: place._id,
        types,
      };
      updatePlaceType(body);
    }
  };

  return (
    <Modal
      open={openTypeModal}
      onClose={closeTypeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openTypeModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            {place?.types?.length == 0 ? "Add Place Types" : "Edit Place Types"}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 3 }}
            className="font-bold text-lg"
          >
            Place Name : {place?.name}
          </Typography>
          <h1 className=" text-blue-800">***Choose types***</h1>

          <div className="flex justify-start items-center py-2">
            <label className="w-20">Category</label>
            <Select
              className="flex-1"
              options={catOptions}
              onChange={(value) => {
                let copyArr = [...types];
                copyArr.unshift(value.value)
                setTypes(copyArr);
              }}
              minMenuHeight={200}
            />
            {errorMsg && (
              <p className="text-sm text-red-700 pl-2">{errorMsg}</p>
            )}
          </div>
          <div className="flex justify-start items-center py-2">
            <label className="w-20">Types</label>
            <Select
              className="flex-1"
              options={options}
              onChange={(value) => {
                setTypes([...types, value.value]);
              }}
              minMenuHeight={200}
            />
            {errorMsg && (
              <p className="text-sm text-red-700 pl-2">{errorMsg}</p>
            )}
          </div>
          {place?.name && types && (
            <div>
              {types.map((type, index) => (
                <div
                  key={index}
                  className="pt-3 flex justify-start items-center"
                >
                  <span className="text-xl font-bold mr-2">{index}:</span>
                  <span className="bg-blue-400 py-1 px-4 text-white">
                    {type}
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
              disabled={types?.length == 0}
              loading={isLoading}
              onClick={handleUpdate}
              className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
            >
              {place?.types?.length == 0 ? "Add Types" : "Update Types"}
            </LoadingButton>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PlaceTypesModal;
