import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  CircularProgress,
  Fade,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import useDebounce from "../../Hooks/useDebounce";
import { searchApi } from "../../Redux/customApi/api";
import {
  useSetOriginalPlaceMutation,
  useUpdatePlaceAddressMutation,
} from "../../Redux/services/servicesApi";

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
  // height: "auto",
  minHeight: "100%",
  pb: 15,
};

const addressType = [
  {
    value: "locality",
    label: "locality",
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
];

const AddOriginalPlaceModal = ({
  openOriginalModal,
  closeOriginalModal,
  place,
  editedPlace,
}) => {
  const [setOriginalPlace, { data, error, isLoading, isSuccess, isError }] =
    useSetOriginalPlaceMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const [searchText, setSearchText] = useState("");
  const [response, setResponse] = useState([]);

  const [currentPlaceId, setCurrentPlaceId] = useState(place?._id || "");

  const debouncedSearchTerm = useDebounce(searchText, 500);

  useEffect(() => {
    setCurrentPlaceId(place?._id);
  }, [place]);

  useEffect(() => {
    if (isSuccess) {
      editedPlace(data?.place);
    }
    if (isError) {
      setErrorMsg(error?.data?.message?.general);
    }
  }, [isSuccess, isError]);

  //SEARCH PLACE
  const searchPlace = async (body) => {
    const api = await searchApi(body);
    setResponse(api.results);
  };

  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        const body = {
          text: searchText,
        };
        if (searchText.length > 0) {
          searchPlace(body);
        } else {
          setResponse([]);
        }
      } else {
        setResponse([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const handleSelect = (item) => {
    if (currentPlaceId != "" || item._id != undefined) {
      const body = {
        place_id: currentPlaceId,
        original_place_id: item._id,
      };
      setOriginalPlace(body);
    } else {
      setErrorMsg("Please select a place or refresh page and try again.");
    }
  };

  return (
    <Modal
      open={openOriginalModal}
      onClose={closeOriginalModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openOriginalModal}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Select Original Place
          </Typography>
          <div className="w-full mt-4">
            <TextField
              error={errorMsg ? true : false}
              helperText={errorMsg}
              className="w-full"
              required
              id="outlined-required"
              label="Search original place"
              value={searchText}
              onChange={(e) => {
                setErrorMsg("");
                setSearchText(e.target.value);
                // handleSearchPlace(e.target.value);
              }}
            />
          </div>
          {isLoading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <div className="my-2 scroll-smooth h-80">
              {response.map((item) => (
                <button
                  key={item?._id}
                  className="block w-full"
                  onClick={(e) => handleSelect(item)}
                >
                  <div className="flex justify-start items-center space-x-4 mt-5 hover:bg-slate-200 cursor-pointer py-2 px-2 w-full">
                    <div>
                      {item?.cover_photo?.small ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${place?.cover_photo?.small?.private_id}`}
                          width={40}
                          height={40}
                          objectFit="cover"
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-10 h-10 bg-gray-800 rounded-full">
                          <h1 className="text-white">{item.name[0]}</h1>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-left">{item.name}</h3>
                      {item?.display_address_available ? (
                        <h2 className="text-left">
                          {item?.display_address?.locality}
                          {", "}
                          {item?.display_address?.adminstrative_area}
                          {", "}
                          {item?.display_address?.country}
                        </h2>
                      ) : (
                        <h2 className="text-left">
                          {item?.address?.administrative_area_level_1},{" "}
                          {item?.address?.country}
                        </h2>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddOriginalPlaceModal;
