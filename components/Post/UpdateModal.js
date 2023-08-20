import React from 'react'
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import { Menu } from '@headlessui/react'
import SettingsIcon from "@mui/icons-material/Settings";
import Details from './Details';
import { useSelector } from 'react-redux';
import TransitionAlerts from '../Alert/Alert';
import UpdatePostComponent from './UpdatePostComponent';
import UpdateRecommendComponent from './UpdateRecommendComponent';
import UpdateVerifiedComponent from './UpdateVerifiedComponent';
import UpdateCoordinatesComponent from './UpdateCoordinatesComponent';
import UpdateGoogleAddress from './UpdateGoogleAddress';

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
    pb: 15,
};
const details = {
    height: "95%",
};

const UpdateModal = ({ open, onModalClose, selected, updateSelected, editCoors }) => {
    const REDUX_SERVERREQUEST = useSelector(state => state.SERVERREQUEST);


    const renderSettingMenuButton = () => (
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-800 hover:text-gray-900 outline-none pt-[0.3rem]">
            <SettingsIcon className="text-[1.1rem]" />
        </Menu.Button>
    )


    return (
        <Modal
            open={open}
            onClose={onModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={[style, details]}>
                    <TransitionAlerts
                        text={REDUX_SERVERREQUEST.errorMsg}
                        alertType="error"
                        showAlert={REDUX_SERVERREQUEST.error}
                    />
                    <div className='grid grid-cols-2 divide-x divide-gray-600'>
                        <Details post={selected} />
                        <div className='pl-4 pr-2'>
                            <UpdatePostComponent post={selected} updateSelectedPost={updateSelected} />
                            <UpdateRecommendComponent post={selected} updateSelectedPost={updateSelected} />
                            <UpdateCoordinatesComponent post={selected} updateSelectedPost={updateSelected} />
                            <UpdateVerifiedComponent post={selected} updateSelectedPost={updateSelected} />
                            <div className='flex justify-start items-center gap-1'>
                                <span>
                                    Manual Coordinates:{" "}
                                    <span className={`${selected?.manual_coordinates && "font-bold text-red-600"}`}>
                                        {selected?.manual_coordinates ? "True" : "False"}
                                    </span>
                                </span>
                            </div>
                            <div className="mt-5">
                                <h1 className="font-bold">Change Address</h1>
                                <UpdateGoogleAddress post={selected} updateSelectedPost={updateSelected} />
                            </div>

                        </div>
                    </div>



                    {/* <div className="flex justify-center mb-2">
                      {selected.name != "" && selected.name != undefined && (
                          // <Text>{`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${selected?.content[0]?.image?.large?.private_id}`}</Text>
                          <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${selected?.content[0]?.image?.large?.private_id}`}
                              width={650}
                              height={650}
                              objectFit="contain"
                          />
                      )}
                  </div>
                  <Typography
                      id="modal-modal-description"
                      sx={{ mt: 3 }}
                      className="font-bold"
                  >
                      Place Name : {selected?.place?.name}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                      Address:
                  </Typography>
                  {selected?.place?.name != "" && selected?.place?.name != undefined && (
                      <div className="pl-4">
                          {Object.keys(selected?.place?.address).map((key, index) => {
                              return (
                                  <p key={index}>
                                      <span className="font-bold">{key}</span> :{" "}
                                      {selected?.place?.address[key]}
                                  </p>
                              );
                          })}
                      </div>
                  )}
                  <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                      Google Types :{" "}
                      {selected?.place?.google_types?.map((type, index) => {
                          return (
                              <span
                                  key={index}
                                  className="bg-green-400 p-1 px-2 mr-2 rounded-[10px]"
                              >
                                  {type}
                              </span>
                          );
                      })}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                      CURRENT STATUS : {selected?.status}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                      Coordinate Status :{" "}
                      <span
                          className={`font-bold ${selected?.coordinate_status ? "text-blue-900" : "text-red-800"
                              }`}
                      >
                          {selected?.coordinate_status ? "True" : "False"}
                      </span>
                  </Typography>
                  <div className="mt-2">
                      <select
                          name="select"
                          className={`w-full bg-gray-200 rounded p-1 border-[0.1rem] ${errorMsg != "" ? "border-red-600" : "border-gra-500"
                              }`}
                          defaultValue={selected?.status}
                          onChange={(e) => {
                              setErrorMsg("");
                              setActionType(e.target.value);
                          }}
                      >
                          <option value="active">Active</option>
                          <option value="silent">Silent</option>
                          <option value="blocked">Blocked</option>
                      </select>
                      <span className="text-red-900 font-medium">{errorMsg}</span>
                  </div>
                  <div className="mt-4">
                      <LoadingButton
                          loading={updateIsLoading}
                          onClick={handleSaveAction}
                          className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
                      >
                          Save
                      </LoadingButton>
                  </div> */}
                </Box>
            </Fade>
        </Modal>
    )
}

export default UpdateModal