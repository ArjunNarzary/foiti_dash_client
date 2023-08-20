import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Fade,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUpdatePlaceAddressMutation } from "../../Redux/services/servicesApi";
import { XCircleIcon } from "@heroicons/react/outline";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "rgba(255, 255, 240, 0.9)",
  overflowY: "scroll",
  boxShadow: 24,
  p: 4,
  zIndex: 20,
  height: "auto",
  pb: 15,
};

const addressType = [
  {
    value: "locality",
    label: "locality",
  },
  {
    value: "neighborhood",
    label: "neighborhood",
  },
  {
    value: "sublocality_level_2",
    label: "sublocality_level_2",
  },
  {
    value: "sublocality_level_1",
    label: "sublocality_level_1",
  },
  {
    value: "administrative_area_level_3",
    label: "administrative_area_level_3",
  },
  {
    value: "administrative_area_level_2",
    label: "administrative_area_level_2",
  },
  {
    value: "administrative_area_level_1",
    label: "State (administrative_area_level_1)",
  },
  {
    value: "country",
    label: "country",
  },
  {
    value: "short_country",
    label: "short_country",
  },
  {
    value: "postal_code",
    label: "postal_code",
  },
];

const UpdateAddressModal = ({
  openAddressModal,
  closeAddressModal,
  place,
  editedPlace,
}) => {
  const [updatePlaceAddress, { data, error, isLoading, isSuccess, isError }] =
    useUpdatePlaceAddressMutation();
  const [addressProp, setAddressProp] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [address, setAddress] = useState(place?.address || {});

  useEffect(() => {
    setAddress(place?.address);
  }, [place]);

  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  }, [isSuccess, isError]);

  const handleUpdateNameAction = () => {
    if (!address?.country?.trim() || !address?.short_country?.trim()) {
      setErrorMsg({
        ...errorMsg,
        property: "Please enter country and short country",
      });
    } else {
      const body = {
        address,
        place_id: place._id,
      };

      updatePlaceAddress(body);
    }
  };

  //HANDLE ADD CLICK
  const handleAdd = () => {
    if (!addressProp.trim()) {
      setErrorMsg({ property: "Please select address property" });
    } else if (!addressValue.trim()) {
      setErrorMsg({ value: "Please enter an address value" });
    } else {
      setAddress({
        ...address,
        [addressProp]: addressValue,
      });
    }
  };

  //Handle Remove property
  const handleRemoveProperty = (key) => {
    setAddress({
      ...address,
      [key]: undefined,
    });
  };

  return (
    <Modal
      open={openAddressModal}
      onClose={closeAddressModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openAddressModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Edit Address
          </Typography>
          <div className="flex justify-between gap-1 mx-4 my-5 items-center">
            <div>
              <TextField
                error={errorMsg?.property || errorMsg?.general ? true : false}
                helperText={errorMsg?.property || errorMsg?.general}
                id="outlined-select-currency"
                select
                label="Select Address Type"
                className="w-[20rem]"
                value={addressProp}
                onChange={(e) => {
                  setErrorMsg({ ...errorMsg, property: "" });
                  setAddressProp(e.target.value);
                }}
              >
                {addressType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                error={errorMsg?.value ? true : false}
                helperText={errorMsg?.value}
                required
                id="outlined-required"
                label="Address Value"
                onChange={(e) => {
                  setErrorMsg({ ...errorMsg, value: "" });
                  setAddressValue(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                className="bg-blue-500 px-6 py-2 rounded-lg text-white font-bold"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
            <div>
              <button
                className="bg-red-500 px-2 py-2 rounded-lg text-white font-[500]"
                onClick={() => setAddress({})}
              >
                REMOVE
              </button>
            </div>
          </div>
          <div className="my-2">
            {place?.name && address && (
              <div className="pl-4">
                {Object.keys(address).map((key, index) => {
                  return (
                    <p key={index} className="flex justify-start items-center">
                      <span className="font-bold">{key}</span> : {address[key]}
                      <button
                        className="ml-2"
                        onClick={() => handleRemoveProperty(key)}
                      >
                        <XCircleIcon className="h-6 w-6 text-red-700" />
                      </button>
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4">
            <LoadingButton
              loading={isLoading}
              onClick={handleUpdateNameAction}
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

export default UpdateAddressModal;
