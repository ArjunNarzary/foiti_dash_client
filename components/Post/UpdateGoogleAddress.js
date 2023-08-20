import React, { useEffect } from 'react'
import Autocomplete from "react-google-autocomplete";
import { useDispatch, useSelector } from 'react-redux';
import { useUpdatePostLoactionMutation } from '../../Redux/services/servicesApi';
import { addPlaceData, removePlaceData } from '../../Redux/slices/addPlaceSlice';
import { resetServerRequest, setServerLoading } from '../../Redux/slices/serverRequestSlice';


const UpdateGoogleAddress = ({ post, updateSelectedPost }) => {
    const dispatch = useDispatch();
    const REDUXPLACE = useSelector((state) => state.NEWPLACE);

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



    //API CALL ON CHANGE OF REDUX PLACE DATA
    useEffect(() => {
        if (REDUXPLACE.name.trim()) {
            const body = {
                post_id: post._id,
                details: REDUXPLACE,
            };
            dispatch(setServerLoading(true))
            updatePostLoaction(body);
        }
    }, [REDUXPLACE]);

    //ON LOCATION UPDATE API CALL REPONSE
    useEffect(() => {
        if (locationIsSuccess) {
            dispatch(removePlaceData());
            updateSelectedPost(locationData.newPost);
            dispatch(resetServerRequest())
        }

        if (locationIsError) {
            console.log(locationError)
            // setErrorMsg(locationError?.data?.message?.general);
            // setAlertText(locationError?.data?.message?.general);
            // setAlertType("error");
            // setShowAlert(true);
            alert(locationError?.data?.message?.general);
            dispatch(removePlaceData());
            dispatch(resetServerRequest())
        }
    }, [locationIsSuccess, locationIsError]);

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

            console.log("new", newPlace);

            dispatch(addPlaceData({ ...newPlace }));
        }
    };

  return (
      <div className="w-full min-h-[10rem] z-40">
          <h1 className="mt-2">
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
  )
}

export default UpdateGoogleAddress