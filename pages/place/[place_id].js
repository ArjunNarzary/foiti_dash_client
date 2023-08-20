import { useRouter } from "next/router";
import Image from "next/image";
import { requireAuthentication } from "../../resources/requireAuthentication";
import {
  useChangePlaceCoverMutation,
  useGetAllTypesQuery,
  useGetPlaceQuery,
  useMergePlaceDisplayAddressMutation,
  useRemoveDuplicatePlaceMutation,
  useToggleDestinationMutation,
  useToggleShowDestinationMutation,
} from "../../Redux/services/servicesApi";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout/Layout";
import TransitionAlerts from "../../components/Alert/Alert";
import { Backdrop, CircularProgress } from "@mui/material";
import { XCircleIcon } from "@heroicons/react/outline";
import { PencilAltIcon } from "@heroicons/react/solid";
import PlaceNameModal from "../../components/Place/PlaceNameModal";
import PlaceCoordinatesModal from "../../components/Place/PlaceCoordinatesModal";
import UpdateAddressModal from "../../components/Place/UpdateAddressModal";
import PlaceTypesModal from "../../components/Place/PlaceTypesModal";
import PlaceAliasModal from "../../components/Place/PlaceAliasModal";
import DisplayAddressModal from "../../components/Place/DisplayAddressModal";
import AddOriginalPlaceModal from "../../components/Place/AddOriginalPlaceModal";
import AddSearchRankModal from "../../components/Place/AddSearchRankModal";
import AddEditorRatingModal from "../../components/Place/AddEditorRatingModal";
import { LoadingButton } from "@mui/lab";
import PlaceDisplayNameModal from "../../components/Place/PlaceDisplayNameModal";

const PlaceDetail = () => {
  const router = useRouter();
  const { place_id } = router.query;
  const fileRef = useRef(null);
  const [place, setPlace] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openDisplayNameModal, setOpenDisplayNameModal] = useState(false);
  const [openCoorModal, setOpenCoorsModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDisplayAddressModal, setOpenDisplayAddressModal] = useState(false);
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openAliasModal, setOpenAliasModal] = useState(false);
  const [openOriginalModal, setOpenOriginalModal] = useState(false);
  const [openSearchRankModal, setOpenSearchRankModal] = useState(false);
  const [openEditorRatingModal, setOpenEditorRatingModal] = useState(false);
  const [typeArray, setTypeArray] = useState([]);

  const { data, isLoading, isSuccess, isError, error } = useGetPlaceQuery({
    place_id,
  });

  const [
    removeDuplicatePlace,
    {
      data: removeDuplicateData,
      error: removeDuplicateError,
      isLoading: removeDuplicateIsLoading,
      isSuccess: removeDuplicateIsSuccess,
      isError: removeDuplicateIsError,
    },
  ] = useRemoveDuplicatePlaceMutation();

  const [
    toggleShowDestination,
    {
      data: showDestinationData,
      error: showDestinationError,
      isLoading: showDestinationIsLoading,
      isSuccess: showDestinationIsSuccess,
      isError: showDestinationIsError,
    },
  ] = useToggleShowDestinationMutation();

  const [
    toggleDestination,
    {
      data: destinationData,
      error: destinationError,
      isLoading: destinationIsLoading,
      isSuccess: destinationIsSuccess,
      isError: destinationIsError,
    },
  ] = useToggleDestinationMutation();

  const {
    data: typeData,
    error: typeError,
    isSuccess: typeIsSuccess,
    isError: typeIsError,
    isLoading: typeIsLoading,
  } = useGetAllTypesQuery();

  const [
    mergePlaceDisplayAddress,
    {
      data: mergeAddressData,
      error: mergeAddressError,
      isSuccess: mergeAddressIsSuccess,
      isError: mergeAddressIsError,
      isLoading: mergeAddressIsLoading,
    },
  ] = useMergePlaceDisplayAddressMutation();

  const [
    changePlaceCover,
    {
      data: coverData,
      error: coverError,
      isSuccess: coverIsSuccess,
      isError: coverIsError,
      isLoading: coverIsLoading,
    },
  ] = useChangePlaceCoverMutation();

  //MERGE PLACE DISPLAY ADDRESS
  useEffect(() => {
    if (coverIsSuccess) {
      setPlace(coverData?.place);
    }

    if (coverIsError) {
      alert(coverError?.data?.message?.general);
      setErrorMsg(coverError?.data?.message?.general);
      setAlertText(coverError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [coverIsSuccess, coverIsError]);

  //UPLOAD IMAGE
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file.name) {
      const body = {
        place_id,
        file,
      };

      changePlaceCover(body);
    }
  };

  //MERGE PLACE DISPLAY ADDRESS
  useEffect(() => {
    if (mergeAddressIsSuccess) {
      setPlace(mergeAddressData?.place);
    }

    if (mergeAddressIsError) {
      alert(mergeAddressError?.data?.message?.general);
      setErrorMsg(mergeAddressError?.data?.message?.general);
      setAlertText(mergeAddressError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [mergeAddressIsSuccess, mergeAddressIsError]);

  //SET PLACE DATA
  useEffect(() => {
    if (isSuccess) {
      setPlace(data?.place);
    }

    if (isError) {
      alert(error?.data?.message?.general);
      setErrorMsg(error?.data?.message?.general);
      setAlertText(error?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [isSuccess, isError]);

  //SET PLACE DATA AFTER REMOVING DUPLICATE PLACE
  useEffect(() => {
    if (removeDuplicateIsSuccess) {
      setPlace(removeDuplicateData?.place);
    }

    if (removeDuplicateIsError) {
      alert(removeDuplicateError?.data?.message?.general);
      setErrorMsg(removeDuplicateError?.data?.message?.general);
      setAlertText(removeDuplicateError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [removeDuplicateIsSuccess, removeDuplicateIsError]);

  //TOGGLE SHOW DESTINATION
  useEffect(() => {
    if (showDestinationIsSuccess) {
      setPlace(showDestinationData?.place);
    }

    if (showDestinationIsError) {
      alert(showDestinationError?.data?.message?.general);
      setErrorMsg(showDestinationError?.data?.message?.general);
      setAlertText(showDestinationError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [showDestinationIsSuccess, showDestinationIsError]);

  //TOGGLE ESTINATION
  useEffect(() => {
    if (destinationIsSuccess) {
      setPlace(destinationData?.place);
    }

    if (destinationIsError) {
      alert(destinationError?.data?.message?.general);
      setErrorMsg(destinationError?.data?.message?.general);
      setAlertText(destinationError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [destinationIsSuccess, destinationIsError]);

  //SET TYPE DATA
  useEffect(() => {
    if (typeIsSuccess) {
      setTypeArray(typeData?.types);
    }

    if (typeIsError) {
      alert(typeError?.data?.message?.general);
      setErrorMsg(typeError?.data?.message?.general);
      setAlertText(typeError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [typeIsSuccess, typeIsError]);

  //Remove element from duplicate array
  const removeDuplicate = (arr) => {
    if (arr) {
      const body = {
        place_id: place?._id,
        duplicate_id: arr,
      };

      removeDuplicatePlace(body);
    }
  };

  //HANDLE SHOW DESTINATIION
  const handleShowDestinations = () => {
    if (place.types[1] == "state") {
      const body = {
        place_id: place?._id,
      };

      toggleShowDestination(body);
    } else {
      // alert()
      setErrorMsg("Custom types must have state type");
      setAlertText("Custom types must have state type");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  //HANDLE DESTINATIION
  const handleDestinations = () => {
    const body = {
      place_id: place?._id,
    };

    toggleDestination(body);
  };

  //HANDLE MERGE PLACE DISPLAY ADDRESS
  const handleMergeAddress = () => {
    const body = {
      place_id: place?._id,
    };

    mergePlaceDisplayAddress(body);
  };

  //HANDLE CLOSE NAME MODAL
  const closeNameModal = () => {
    setOpenNameModal(false);
  };
  //HANDLE CLOSE DISPLAY NAME MODAL
  const closeDisplayNameModal = () => {
    setOpenDisplayNameModal(false);
  };
  //HANDLE CLOSE COORS MODAL
  const closeCoorsModal = () => {
    setOpenCoorsModal(false);
  };

  //HANDLE CLOSE ADDRESS MODAL
  const closeAddressModal = () => {
    setOpenAddressModal(false);
  };

  //HANDLE CLOSE ADDRESS MODAL
  const closeDisplayAddressModal = () => {
    setOpenDisplayAddressModal(false);
  };

  //HANDLE CLOSE TYPES MODAL
  const closeTypeModal = () => {
    setOpenTypeModal(false);
  };

  //HANDLE CLOSE ALIAS MODAL
  const closeAliasModal = () => {
    setOpenAliasModal(false);
  };

  //HANDLE CLOSE ORIGINAL MODAL
  const closeOriginalModal = () => {
    setOpenOriginalModal(false);
  };

  //HANDLE CLOSE SEARCH RANK MODAL
  const closeSearchRankModal = () => {
    setOpenSearchRankModal(false);
  };
  //HANDLE CLOSE EDITOR RATING MODAL
  const closeEditorRatingModal = () => {
    setOpenEditorRatingModal(false);
  };

  const editedPlace = (newPlace) => {
    setPlace(newPlace);
    setOpenNameModal(false);
    setOpenDisplayNameModal(false);
    setOpenCoorsModal(false);
    setOpenAddressModal(false);
    setOpenDisplayAddressModal(false);
    setOpenTypeModal(false);
    setOpenAliasModal(false);
    setOpenOriginalModal(false);
    setOpenSearchRankModal(false);
    setOpenEditorRatingModal(false);
  };
  return (
    <Layout>
      <TransitionAlerts
        text={alertText}
        alertType={alertType}
        showAlert={showAlert}
      />
      {isLoading ||
      removeDuplicateIsLoading ||
      showDestinationIsLoading ||
      destinationIsLoading ||
      coverIsLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="mb-40">
          <h1 className=" flex text-center font-bold text-2xl justify-center align-middle">
            {place?.name}{" "}
            <button
              className="ml-4"
              onClick={() => {
                setOpenNameModal(true);
              }}
            >
              <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
            </button>
          </h1>
          {place?.name && (
            <div className="md:grid md:grid-cols-2 md:gap-1 my-4">
              <div className="relative">
                {place?.cover_photo?.large && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${place?.cover_photo?.large?.private_id}`}
                    width={600}
                    height={600}
                    objectFit="contain"
                  />
                )}
                <button
                  className="absolute top-2 right-2 z-50 bg-black p-1"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                >
                  <PencilAltIcon className="h-5 w-5 text-white hover:text-blue-400" />
                </button>
                <input
                  className="hidden"
                  ref={fileRef}
                  type="file"
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                />
              </div>
              <div className="border-l-2 pl-4">
                {/* ALIAS NAME */}
                <h2 className="mt-3 text-lg font-semibold flex justify-start items-center">
                  Alias :
                  <button
                    className="ml-4"
                    onClick={() => {
                      setOpenAliasModal(true);
                    }}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {place?.alias.length > 0 ? (
                  <p className="ml-5 mt-2">
                    {place?.alias?.map((name) => (
                      <span
                        className="mr-2 px-2 py-1 bg-blue-500 rounded-2xl text-white"
                        key={name}
                      >
                        {name}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="ml-5 mt-2">No Alias added</p>
                )}

                {/* DISPLAY NAME */}
                <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                  Display Name : &nbsp;<span>{place?.display_name}</span>
                  <button
                    className="ml-4"
                    onClick={() => {
                      setOpenDisplayNameModal(true);
                    }}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {/* COORDINATES */}
                <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                  Coordinate :
                  <button
                    className="ml-4"
                    onClick={() => {
                      setOpenCoorsModal(true);
                    }}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {/* SHOW DESTINATION */}
                {place?.types?.length > 1 && place?.types[1] == "state" && (
                  <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                    Show Destinations :{" "}
                    <span> {place?.show_destinations ? "TRUE" : "FALSE"}</span>
                    <button className="ml-4" onClick={handleShowDestinations}>
                      <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                    </button>
                  </h2>
                )}
                {/* SHOW DESTINATION */}
                <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                  Destination :{" "}
                  <span> {place?.destination ? " TRUE" : " FALSE"}</span>
                  <button className="ml-4" onClick={handleDestinations}>
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {/* REVIEW STATUS */}
                <h2 className="mt-3 text-lg font-semibold">
                  Reviewed Status :{" "}
                  <span>{place?.reviewed_status ? "TRUE" : "FALSE"}</span>
                </h2>
                {/* CREATED PLACE */}
                <h2 className="mt-3 text-lg font-semibold">
                  Created Place :{" "}
                  <span>{place?.created_place ? "TRUE" : "FALSE"}</span>
                </h2>
                {/* SEARCH RANKING */}
                <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                  Search Ranking : <span> {place?.search_rank}</span>
                  <button
                    className="ml-4"
                    onClick={() => setOpenSearchRankModal(true)}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {/* EDITOR'S RATING */}
                <h2 className="text-lg font-semibold flex justify-start items-center mt-3">
                  Editor&apos;s Rationg :<span>{place?.editor_rating}</span>
                  <button
                    className="ml-4"
                    onClick={() => setOpenEditorRatingModal(true)}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {/* GOOGLE TYPES */}
                <h2 className="mt-3 text-lg font-semibold">Google Types :</h2>
                <p className="ml-5 mt-2">
                  {place?.google_types?.map((type) => (
                    <span
                      className="mr-2 px-2 py-1 bg-green-500 rounded-2xl"
                      key={type}
                    >
                      {type}
                    </span>
                  ))}
                </p>
                {/* CUSTOM TYPES */}
                <h2 className="mt-3 text-lg font-semibold flex justify-start items-center">
                  Custom Types :
                  <button
                    className="ml-4"
                    onClick={() => {
                      setOpenTypeModal(true);
                    }}
                  >
                    <PencilAltIcon className="h-5 w-5 text-red-600 hover:text-blue-400" />
                  </button>
                </h2>
                {place?.types.length > 0 ? (
                  <p className="ml-5 mt-2">
                    {place?.types?.map((type) => (
                      <span
                        className="mr-2 px-2 py-1 bg-blue-500 rounded-2xl text-white"
                        key={type}
                      >
                        {type}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="ml-5 mt-2">Not Types added</p>
                )}

                <h2 className="mt-3 text-lg font-semibold">
                  Saved : <span>{place?.saved?.length}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Views : <span>{place?.viewers?.length}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Location Clicked :{" "}
                  <span>{place?.location_viewers?.length}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Reviews : <span>{place?.review_id?.length}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Total Posts : <span>{place?.posts?.length}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Duplicate Place :{" "}
                  <span>{place?.duplicate ? "TRUE" : "FALSE"}</span>
                </h2>
                <h2 className="mt-3 text-lg font-semibold">
                  Display Address Available :{" "}
                  <span>
                    {place?.display_address_available ? "TRUE" : "FALSE"}
                  </span>
                </h2>
              </div>
            </div>
          )}
          {/* ADDRESS SECTION */}
          <section className="flex justify-between space-x-2">
            {/* ADDRESS  */}
            <div className="flex-1">
              <h1 className="relative text-center text-2xl font-bold bg-slate-600 text-white py-2">
                Address
                <button
                  className="absolute top-2 right-4 text-lg text-white border-2 rounded px-10 bg-red-500"
                  onClick={() => setOpenAddressModal(true)}
                >
                  Edit
                </button>
              </h1>
              <div>
                <h2 className="text-lg font-bold">Address</h2>
                {place?.name != "" && place?.name != undefined && (
                  <div className="pl-4">
                    {Object.keys(place?.address).map((key, index) => {
                      return (
                        <p key={index}>
                          <span className="font-bold">{key}</span> :{" "}
                          {place?.address[key]}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* DISPLAY ADDRESS  */}
            {/* mergePlaceDisplayAddress */}
            <div className="flex-1">
              {/* <h1 className="relative text-center text-2xl font-bold bg-slate-600 text-white py-2">
                <LoadingButton
                  loading={mergeAddressIsLoading}
                  onClick={handleMergeAddress}
                  className="absolute top-2 left-4 text-white border-2 py-1 rounded px-10 bg-green-500 capitalize"
                >
                  Copy
                </LoadingButton>
                Display Address
                <button
                  className="absolute top-2 right-4 text-lg text-white border-2 rounded px-10 bg-red-500"
                  onClick={() => setOpenDisplayAddressModal(true)}
                >
                  {place?.display_address_available ? "Edit" : "Add"}
                </button>
              </h1> */}
              <h1 className="text-2xl font-bold bg-slate-600 text-white py-2 flex justify-between items-center px-4">
                <LoadingButton
                  loading={mergeAddressIsLoading}
                  onClick={handleMergeAddress}
                  className="text-white border-2 py-1 rounded px-10 bg-green-500 capitalize"
                >
                  Copy
                </LoadingButton>
                <div>Display Address</div>
                <button
                  className="text-lg text-white border-2 rounded px-10 bg-red-500"
                  onClick={() => setOpenDisplayAddressModal(true)}
                >
                  {place?.display_address_available ? "Edit" : "Add"}
                </button>
              </h1>
              <div>
                {/* <h2 className="text-lg font-bold">Address</h2> */}
                {place?.name != "" &&
                  (place?.display_address?.locality != undefined ||
                    place?.display_address?.admin_area_2 != undefined ||
                    place?.display_address?.admin_area_1 != undefined ||
                    place?.display_address?.country != undefined) && (
                    <div className="pl-4">
                      {Object.keys(place?.display_address).map((key, index) => {
                        return (
                          <p key={index}>
                            <span className="font-bold">{key}</span> :{" "}
                            {place?.display_address[key]}
                          </p>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </section>
          {/* DUPLICATE AND ORIGINAL PLACE */}
          <section className="flex justify-between space-x-2 mt-3">
            <div className="flex-1">
              <h1 className="relative text-center text-2xl font-bold bg-slate-600 text-white py-2">
                Duplicate Places
              </h1>
              {place?.duplicate_place_id?.length > 0 && (
                <div>
                  {place?.duplicate_place_id.map((dPlace, index) => (
                    <div
                      key={index}
                      className="pt-3 flex justify-start items-center"
                    >
                      <span className="text-xl font-bold mr-2">
                        {dPlace?.name}
                      </span>
                      <button
                        className="ml-2"
                        onClick={() => removeDuplicate(dPlace?._id)}
                      >
                        <XCircleIcon className="h-6 w-6 text-red-700" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="relative text-center text-2xl font-bold bg-slate-600 text-white py-2">
                Original Places
                <button
                  className="absolute top-2 right-4"
                  onClick={() => setOpenOriginalModal(true)}
                >
                  {/* {place.duplicate ? "Edit Original" : "Add Original"} */}
                  <PencilAltIcon className="h-7 w-7 text-white hover:text-gray-400" />
                </button>
              </h1>
              {place?.original_place_id?._id && (
                <div>
                  <h2 className="text-lg font-bold">
                    <a
                      className="hover:text-blue-900"
                      href={`/place/${place?.original_place_id?._id}`}
                    >
                      {place?.original_place_id?.name}
                    </a>
                  </h2>
                  {Object.keys(place?.original_place_id?.address).map(
                    (key, index) => {
                      return (
                        <p key={index}>
                          <span className="font-bold">{key}</span> :{" "}
                          {place?.original_place_id?.address[key]}
                        </p>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      <PlaceNameModal
        openNameModal={openNameModal}
        closePlaceNameModal={closeNameModal}
        place={place}
        editedPlace={editedPlace}
      />
      <PlaceDisplayNameModal
        openDisplayNameModal={openDisplayNameModal}
        closeDisplayNameModal={closeDisplayNameModal}
        place={place}
        editedPlace={editedPlace}
      />
      <PlaceCoordinatesModal
        openCoorModal={openCoorModal}
        closeCoorModal={closeCoorsModal}
        place={place}
        editedPlace={editedPlace}
      />
      <UpdateAddressModal
        openAddressModal={openAddressModal}
        closeAddressModal={closeAddressModal}
        place={place}
        editedPlace={editedPlace}
      />
      <DisplayAddressModal
        openDisplayAddressModal={openDisplayAddressModal}
        closeDisplayAddressModal={closeDisplayAddressModal}
        place={place}
        editedPlace={editedPlace}
      />
      <PlaceTypesModal
        typeArray={typeArray}
        openTypeModal={openTypeModal}
        closeTypeModal={closeTypeModal}
        place={place}
        editedPlace={editedPlace}
      />
      <PlaceAliasModal
        openAliasModal={openAliasModal}
        closeAliasModal={closeAliasModal}
        place={place}
        editedPlace={editedPlace}
      />
      <AddOriginalPlaceModal
        openOriginalModal={openOriginalModal}
        closeOriginalModal={closeOriginalModal}
        place={place}
        editedPlace={editedPlace}
      />
      <AddSearchRankModal
        openSearchRankModal={openSearchRankModal}
        closeSearchRankModal={closeSearchRankModal}
        place={place}
        editedPlace={editedPlace}
      />
      <AddEditorRatingModal
        openEditorRatingModal={openEditorRatingModal}
        closeEditorRatingModal={closeEditorRatingModal}
        place={place}
        editedPlace={editedPlace}
      />
    </Layout>
  );
};

export default PlaceDetail;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
