import { Backdrop, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransitionAlerts from "../../../../components/Alert/Alert";
import Layout from "../../../../components/Layout/Layout";
import {
  useChangePostPlaceMutation,
  useUpdatePostLoactionMutation,
  useViewPostDetailsQuery,
} from "../../../../Redux/services/servicesApi";
import {
  addPlaceData,
  removePlaceData,
} from "../../../../Redux/slices/addPlaceSlice";
import { requireAuthentication } from "../../../../resources/requireAuthentication";

import Autocomplete from "react-google-autocomplete";
import { searchApi } from "../../../../Redux/customApi/api";
import useDebounce from "../../../../Hooks/useDebounce";
import { ConstructionOutlined } from "@mui/icons-material";

const PostDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { post_id } = router.query;
  const REDUXPLACE = useSelector((state) => state.NEWPLACE);
  const [post, setPost] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [createdPlaces, setCreatedPlaces] = useState([]);
  const [searchText, setSearchText] = useState("");

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const { data, isLoading, isSuccess, isError, error } =
    useViewPostDetailsQuery({ post_id });

  const [
    updatePostLoaction,
    {
      data: locationData,
      isLoading: locationIsLoading,
      isSuccess: locationIsSuccess,
      isError: locationIsError,
      error: locationError,
    },
  ] = useUpdatePostLoactionMutation();

  const [
    changePostPlace,
    {
      data: changePlaceData,
      isLoading: changePlaceIsLoading,
      isSuccess: changePlaceIsSuccess,
      isError: changePlaceIsError,
      error: changePlaceError,
    }
  ] = useChangePostPlaceMutation();

  useEffect(() => {
    if (isSuccess) {
      setPost(data.post);
    }

    if (isError) {
      setErrorMsg(error.data.message.general);
      setAlertText(error.data.message.general);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [isSuccess, isError]);

  //ON LOCATION UPDATE API CALL REPONSE
  useEffect(() => {
    if (locationIsSuccess) {
      dispatch(removePlaceData());
      setPost(locationData.newPost);
    }

    if (locationIsError) {
      setErrorMsg(locationError?.data?.message?.general);
      setAlertText(locationError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
      dispatch(removePlaceData());
    }
  }, [locationIsSuccess, locationIsError]);

  //ON LOCATION CHANGE API CALL REPONSE
  useEffect(() => {
    if (changePlaceIsSuccess) {
      setPost(changePlaceData.newPost);
    }

    if (changePlaceIsError) {
      setErrorMsg(changePlaceError?.data?.message?.general);
      setAlertText(changePlaceError?.data?.message?.general);
      setAlertType("error");
      setShowAlert(true);
      dispatch(removePlaceData());
    }
  }, [changePlaceIsSuccess, changePlaceIsError]);

  //API CALL ON CHANGE OF REDUX PLACE DATA
  useEffect(() => {
    if (REDUXPLACE.name.trim()) {
      const body = {
        post_id,
        details: REDUXPLACE,
      };

      updatePostLoaction(body);
    }
  }, [REDUXPLACE]);

  //HANDLE LOCATION SELECT
  const handleSelect = (results) => {
    //Process Data
    let addressComponent = {};
    if (results?.name) {
      results.address_components.forEach((address) => {
        addressComponent[address.types[0]] = address.long_name;
        if (address.types[0] == "country") {
          addressComponent["short_country"] = address.short_name;
        }
      });

      const newPlace = {
        name: results.name,
        place_id: results.place_id,
        types: results.types,
        address: addressComponent,
        coordinates: {
          lat: results.geometry.location.lat(),
          lng: results.geometry.location.lng(),
        },
        timing: results?.opening_hours?.weekday_text,
        phone_number: results?.formatted_phone_number,
      };
      dispatch(addPlaceData({ ...newPlace }));
    }
  };

  //SEARCH CREATED PLACE
  //SEARCH PLACE
  const searchPlace = async (body) => {
    const api = await searchApi(body);
    setCreatedPlaces(api.results);
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
          setCreatedPlaces([]);
        }
      } else {
        setCreatedPlaces([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const handleCreatedPlaceClick = (place) => {
    if (!post?.place?._id || !place?._id){
      setErrorMsg("No place selected. Please refresh and try again");
      setAlertText("No place selected. Please refresh and try again");
      setAlertType("error");
      setShowAlert(true);
    }
    if(post?.place?._id == place?._id){
      setErrorMsg("Cannot change to same place.");
      setAlertText("Cannot change to same place.");
      setAlertType("error");
      setShowAlert(true);
    }else{
      const body = {
        post_id: post._id,
        place_id: place._id
      }

      changePostPlace(body);
    }
  }

  return (
    <Layout>
      <TransitionAlerts
        text={alertText}
        alertType={alertType}
        showAlert={showAlert}
      />
      {isLoading || locationIsLoading || changePlaceIsLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="mb-40">
          <h1 className="text-center font-bold text-2xl">
            {post?.place?.name}
          </h1>
          {post?.name && (
            <div className="md:grid md:grid-cols-2 md:gap-1 my-4">
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${post?.content[0]?.image?.large?.private_id}`}
                  width={450}
                  height={450}
                  objectFit="contain"
                />
              </div>
              <div className="border-l-2 pl-4">
                <h2 className="text-lg font-bold">User: {post?.user?.name}</h2>
                <h2 className="text-lg font-semibold">Caption :</h2>
                <p>{post?.caption}</p>
                <h2 className="text-lg font-semibold">Coordinate :</h2>
                {post?.coordinate_status && (
                  <>
                    <p>
                      <span>Latitute :</span>
                      {post?.content[0]?.coordinate?.lat}
                    </p>
                    <p>
                      <span>Longitute :</span>
                      {post?.content[0]?.coordinate?.lng}
                    </p>
                  </>
                )}
                <h2 className="text-lg font-medium">
                  Viewers: {post?.viewers?.length}
                </h2>
                <h2 className="text-lg font-medium">
                  Likes: {post?.like?.length}
                </h2>
                <h2 className="text-lg font-medium">
                  Location Clicked: {post?.location_viewers?.length}
                </h2>
                <h2 className="text-lg font-medium">Status: {post?.status}</h2>
                <h2 className="text-lg font-medium">
                  Uploaded On: {post?.createdAt}
                </h2>
                <h2 className="text-lg font-medium">
                  Last updated O: {post?.updatedAt}
                </h2>
              </div>
            </div>
          )}
          <h1 className="relative text-center text-2xl font-bold bg-slate-600 text-white py-2">
            Place Details
            {/* <button
              className="absolute top-2 right-4 text-lg text-white border-2 rounded px-10 bg-red-500"
              onClick={() => setOpenLocationModal(true)}
            >
              Edit
            </button> */}
          </h1>
          <div>
            <div className="pt-2 flex justify-between space-x-2">
              <div className="w-full">
                <h1 className="font-semibold">
                  Google Address
                </h1>
                <Autocomplete
                  className="w-full p-2 my-2 border-2 mb-4"
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API}
                  onPlaceSelected={handleSelect}
                  options={{
                    types: [],
                    fields: [
                      "formatted_address",
                      "geometry.location",
                      "address_components",
                      "name",
                      "place_id",
                      "types",
                      "formatted_phone_number",
                      "opening_hours"
                    ],
                  }}
                />
              </div>
              <div className="w-full">
                  <h1 className="font-semibold">
                    Created Place
                  </h1>
                  <input type="text" className="border-2 mt-2 border-gray-200 p-2 w-full" 
                    placeholder="Search place"
                    value={searchText} 
                    onChange={(e) => {
                      setSearchText(e.target.value)
                      setErrorMsg("");
                      }} 
                  />
                  {errorMsg && (<p className="text-red-500 text-xs">{errorMsg}</p>)}
                  <div className="w-full bg-red-400">
                    {createdPlaces.length > 0 && (<div className="absolute">
                        {createdPlaces.map(place => {
                            const addressArr = [];
                          if (place?.display_address?.sublocality){
                            addressArr.push(place?.display_address?.sublocality)
                          }
                          if (place?.display_address?.locality){
                            addressArr.push(place?.display_address?.locality)
                          }
                          if (place?.display_address?.admin_arear_2){
                            addressArr.push(place?.display_address?.admin_arear_2)
                          }
                          if (place?.display_address?.admin_arear_1) {
                            addressArr.push(place?.display_address?.admin_arear_1)
                          }
                          if (place?.display_address?.country) {
                            addressArr.push(place?.display_address?.country)
                          }

                          const formatedAdd = addressArr.join(", ");
                          return (
                          <div key={place._id} onClick={() => handleCreatedPlaceClick(place)} className="bg-slate-100 w-full my-1 py-1 px-2 cursor-pointer hover:bg-slate-200">
                            <h6 className="font-semibold text-sm">{place.name}</h6>
                            <p className="text-xs">
                                {formatedAdd}
                            </p>
                          </div>
                        )})}
                    </div>)}
                  </div>

              </div>
            </div>
            <h2 className="text-lg font-bold">Address</h2>
            {post?.place?.name != "" && post?.place?.name != undefined && (
              <div className="pl-4">
                {Object.keys(post?.place?.address).map((key, index) => {
                  return (
                    <p key={index}>
                      <span className="font-bold">{key}</span> :{" "}
                      {post?.place?.address[key]}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PostDetails;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
