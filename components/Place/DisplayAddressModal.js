import { XCircleIcon } from "@heroicons/react/outline";
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
import { useUpdatePlaceDisplayAddressMutation } from "../../Redux/services/servicesApi";

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
    value: "sublocality",
    label: "sublocality",
  },
  {
    value: "admin_area_2",
    label: "admin_area_2",
  },
  {
    value: "admin_area_1",
    label: "admin_area_1",
  },
  {
    value: "country",
    label: "country",
  },
  {
    value: "short_country",
    label: "short country",
  },
];

const DisplayAddressModal = ({
  openDisplayAddressModal,
  closeDisplayAddressModal,
  place,
  editedPlace,
}) => {
  const [
    updatePlaceDisplayAddress,
    { data, error, isLoading, isSuccess, isError },
  ] = useUpdatePlaceDisplayAddressMutation();
  const [addressProp, setAddressProp] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [address, setAddress] = useState(place?.address || {});

  useEffect(() => {
    setAddress(place?.display_address);
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
    if (
      !address?.locality &&
      !address?.admin_area_2 &&
      !address?.admin_area_1 &&
      !address?.country
    ) {
      setErrorMsg({ value: "Please add atleast 1 property value address" });
    } else {
      const body = {
        address,
        place_id: place._id,
      };
      updatePlaceDisplayAddress(body);
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

  //HANDLE REMOVE CLICK
  const handleRemove = () => {
    setAddress({});
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
      open={openDisplayAddressModal}
      onClose={closeDisplayAddressModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openDisplayAddressModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            {place.display_address_available ? "Add" : "Edit"} Display Address
          </Typography>
          <div className="flex justify-between space-x-3 my-5 items-center">
            <div>
              <TextField
                error={errorMsg?.property || errorMsg?.general ? true : false}
                helperText={errorMsg?.property || errorMsg?.general}
                id="outlined-select-currency"
                select
                label="Select Address Type"
                className="w-[15rem]"
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
            <div className="flex-1">
              <TextField
                error={errorMsg?.value ? true : false}
                helperText={errorMsg?.value}
                required
                id="outlined-required"
                label="Address Value"
                className="w-full"
                onChange={(e) => {
                  setErrorMsg({ ...errorMsg, value: "" });
                  setAddressValue(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                className="bg-blue-500 px-6 py-2 rounded-lg text-white font-[500]"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
            <div>
              <button
                className="bg-red-500 px-2 py-2 rounded-lg text-white font-[500]"
                onClick={handleRemove}
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
              {place.display_address_available ? "Update" : "Edit"}
            </LoadingButton>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DisplayAddressModal;
