import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Layout from "../../../components/Layout/Layout";
import { requireAuthentication } from "../../../resources/requireAuthentication";
import {
  useUpdateCoordinateMutation,
  useUpdatePostStatusMutation,
  useUserPostsQuery,
} from "../../../Redux/services/servicesApi";
import TransitionAlerts from "../../../components/Alert/Alert";
import Link from "next/link";

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
  // display: "block",
  // height: "100%",
  pb: 15,
};
const details = {
  height: "100%",
};
const coors = {
  height: "auto%",
};

const Post = () => {
  const router = useRouter();
  const { user_id } = router.query;
  const { data, isSuccess, isError, error, isLoading } = useUserPostsQuery({
    user_id,
  });

  const [
    updatePostStatus,
    {
      data: updateData,
      error: updateError,
      isSuccess: updateIsSuccess,
      isError: updateIsError,
      isLoading: updateIsLoading,
    },
  ] = useUpdatePostStatusMutation();

  //Update Coordinates
  const [
    updateCoordinates,
    {
      data: updateCoordinatesData,
      error: updateCoordinatesError,
      isSuccess: updateCoordinatesIsSuccess,
      isError: updateCoordinatesIsError,
      isLoading: updateCoordinatesIsLoading,
    },
  ] = useUpdateCoordinateMutation();

  const [posts, setPosts] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openCoorModal, setOpenCoorModal] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setPosts(data?.posts);
    }

    if (isError) {
      setAlertText(error?.data?.message?.general || error?.data?.message);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (updateIsSuccess) {
      setActionType("");
      setOpen(false);
      setSelected({});
      setAlertText(updateData?.message || "Post updated successfully");
      setAlertType("success");
      setShowAlert(true);
      //Update posts
      const newPosts = posts.map((post) => {
        if (post._id.toString() === updateData.post._id.toString()) {
          return {
            ...post,
            status: updateData.post.status,
          };
        }
        return post;
      });

      setPosts(newPosts);
    }

    if (updateIsError) {
      if (updateError?.status == 401) {
        setErrorMsg(updateError?.data?.message?.action);
      } else {
        setAlertText(
          updateError?.data?.message?.general ||
            "Something went please try again"
        );
        setAlertType("error");
        setShowAlert(true);
        setOpen(false);
      }
    }
  }, [updateIsSuccess, updateIsError]);

  useEffect(() => {
    if (updateCoordinatesIsSuccess) {
      setOpenCoorModal(false);
      setSelected({});
      setLat("");
      setLng("");
      setAlertText(updateCoordinatesData?.message || "Coordinates updated");
      setAlertType("success");
      setShowAlert(true);

      //Update posts
      const newPosts = posts.map((post) => {
        if (post._id.toString() === updateCoordinatesData.post._id.toString()) {
          return {
            ...post,
            coordinate_status: updateCoordinatesData.post.coordinate_status,
            content: updateCoordinatesData.post.content,
          };
        }
        return post;
      });

      setPosts(newPosts);
    }

    if (updateCoordinatesIsError) {
      setErrorMsg({
        lng:
          updateCoordinatesError?.data?.message?.lng ||
          updateCoordinatesError?.data?.message?.general,
        lat: updateCoordinatesError?.data?.message?.lat,
      });
    }
  }, [updateCoordinatesIsSuccess, updateCoordinatesIsError]);

  const selectPost = (post) => {
    setSelected(post);
    setActionType("");
    setOpen(true);
  };

  const editCoors = (post) => {
    setSelected(post);
    setOpenCoorModal(true);
  };

  const handleSaveAction = (e) => {
    e.preventDefault();
    if (actionType == "") {
      setErrorMsg("Please select action type ");
    } else if (selected?.name == undefined || selected?.name == "") {
      setAlertText("Please choose the post first");
      setAlertType("error");
      setShowAlert(true);
      setOpen(false);
    } else {
      const body = {
        post_id: selected._id,
        action: actionType,
      };
      updatePostStatus(body);
      setOpen(false);
    }
  };

  const handleUpdateCoorAction = (e) => {
    e.preventDefault();
    if (!selected?.name) return;

    if (lat == "") {
      setErrorMsg({ lat: "Please enter valid latitude" });
    } else if (lng == "") {
      setErrorMsg({ lng: "Please enter valid longitude" });
    } else {
      const body = {
        post_id: selected._id,
        lat,
        lng,
      };
      updateCoordinates(body);
    }
  };

  return (
    <Layout>
      <TransitionAlerts
        text={alertText}
        alertType={alertType}
        showAlert={showAlert}
      />
      {isLoading || updateIsLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          <h1 className="text-2xl my-2">
            Post uploaded by{" "}
            <span className="font-bold">{posts[0]?.user?.name}</span>
          </h1>
          <div
            // className="lg:columns-4 md:columns-3 columns-1 md:gap-4 gap-1 h-full">
            className="grid lg:grid-cols-6 md:grid-cols-4  md:gap-4 grid-cols-1 gap-2 h-full"
          >
            {posts.map((post) => {
              return (
                <div
                  className="justify-center mb-2 bg-gray-100 p-2 w-full block"
                  key={post._id}
                >
                  <button key={post._id} onClick={() => selectPost(post)}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`}
                      height={400}
                      width={400}
                      objectFit="cover"
                    />
                  </button>
                  <h2 className="font-bold">{post?.place?.name}</h2>
                  {/* {post.caption && (
                    <p className="p-2 bg-white">{post?.caption}</p>
                  )} */}
                  <h2 className="flex justify-start items-center">
                    Coordinate Status:{" "}
                    <span
                      className={`font-bold ${
                        post?.coordinate_status
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {post?.coordinate_status ? "TRUE" : "FALSE"}
                    </span>
                    <button className="ml-2" onClick={() => editCoors(post)}>
                      <SettingsIcon className="text-[1.2rem]" />
                    </button>
                  </h2>
                  <div>
                    <h2>
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          post.status == "active"
                            ? "text-green-800"
                            : "text-blue-800"
                        }`}
                      >
                        {post?.status}
                      </span>
                    </h2>
                    <Link href={`/admin/post/details/${post._id}`}>
                      <button className="w-full bg-green-700 text-white rounded p-1 mt-2">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setSelected({});
          setActionType("");
          setOpen(false);
        }}
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
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              TAKE ACTION
            </Typography>
            <div className="flex justify-center mb-2">
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
            <Typography
              id="modal-modal-description"
              sx={{ mt: 3 }}
              className="font-bold"
            >
              {selected.caption && (
                    <p className="p-2 bg-white">{selected?.caption}</p>
                  )}
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
                className={`font-bold ${
                  selected?.coordinate_status ? "text-blue-900" : "text-red-800"
                }`}
              >
                {selected?.coordinate_status ? "True" : "False"}
              </span>
            </Typography>
            <div className="mt-2">
              <select
                name="select"
                className={`w-full bg-gray-200 rounded p-1 border-[0.1rem] ${
                  errorMsg != "" ? "border-red-600" : "border-gra-500"
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
            </div>
          </Box>
        </Fade>
      </Modal>

      {/* MODAL FOR ADDING?EDITING COORDINATES */}
      <Modal
        open={openCoorModal}
        onClose={() => {
          setSelected({});
          setActionType("");
          setOpenCoorModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openCoorModal}>
          <Box sx={[style, coors]}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              {selected?.coordinate_status ? "Edit" : "Add"} Coordinates
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 3 }}
              className="font-bold"
            >
              Place Name : {selected?.place?.name}
            </Typography>
            <div>
              <TextField
                error={errorMsg?.lat ? true : false}
                helperText={errorMsg.lat}
                required
                id="outlined-required"
                label="Latitude"
                defaultValue={
                  selected.name ? selected?.content[0]?.coordinate?.lat : ""
                }
                onChange={(e) => {
                  setErrorMsg("");
                  setLat(e.target.value);
                }}
                className="w-full mt-4"
              />

              <TextField
                error={errorMsg?.lng ? true : false}
                helperText={errorMsg.lng}
                required
                id="outlined-required"
                label="Longitute"
                defaultValue={
                  selected.name ? selected?.content[0]?.coordinate?.lng : ""
                }
                onChange={(e) => {
                  setErrorMsg("");
                  setLng(e.target.value);
                }}
                className="w-full mt-4"
              />
            </div>

            <div className="mt-4">
              <LoadingButton
                loading={updateCoordinatesIsLoading}
                onClick={handleUpdateCoorAction}
                className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
              >
                {selected?.coordinate_status ? "Edit" : "Save"}
              </LoadingButton>
            </div>
          </Box>
        </Fade>
      </Modal>
    </Layout>
  );
};

export default Post;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
