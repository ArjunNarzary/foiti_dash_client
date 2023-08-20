import React, { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { requireAuthentication } from "../../resources/requireAuthentication";
import TransitionAlerts from "../../components/Alert/Alert";
import Link from "next/link";
import {
  useGetAllPostMutation,
  useGetAllPostWithCoordinatesMutation,
  useUpdateCoordinateMutation,
  useUpdatePostStatusMutation,
} from "../../Redux/services/servicesApi";
import {
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Box,
} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import PostCard from "../../components/Post/PostCard";
import UpdateModal from "../../components/Post/UpdateModal";
import { useSelector } from "react-redux";

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

const AllPost = () => {
  const REDUX_SERVERREQUEST = useSelector(state => state.SERVERREQUEST);

  const [posts, setPosts] = useState([]);
  const [totalPost, setTotalPost] = useState([]);
  const [coordinateStatus, setCoordinateStatus] = useState("");
  const [active, setActive] = useState("");
  const [skip, setSkip] = useState(0);
  const [firstFetch, setFirstFetch] = useState(true);
  const [hasMoreItems, setHasMoreItems] = useState(true);
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

  const [
    getAllPost,
    { isSuccess, isError, isLoading, error, data },
  ] = useGetAllPostMutation();

  // const [
  //   updatePostStatus,
  //   {
  //     data: updateData,
  //     error: updateError,
  //     isSuccess: updateIsSuccess,
  //     isError: updateIsError,
  //     isLoading: updateIsLoading,
  //   },
  // ] = useUpdatePostStatusMutation();

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

  const getFirstData = () => {
    const body = {
      skip: 0,
      active,
      coordinateStatus
    };
    getAllPost(body);
  }

  useEffect(() => {
    setFirstFetch(true);
    getFirstData();
  }, []);

  //Search filter
  const filterSearch = () => {
    setFirstFetch(true);
    getFirstData();
  }

  //Clear filter and search
  const clearFilter = () => {
    setFirstFetch(true);
    setActive("");
    setCoordinateStatus("");
    const body = {
      skip: 0,
      active: "",
      coordinateStatus: ""
    };
    getAllPost(body);

  }

  useEffect(() => {
    if (isSuccess) {
      setTotalPost(data?.totalPostCount);
      if (firstFetch) {
        setPosts(data?.allPosts);
        setFirstFetch(false);
      } else {
        setPosts([...posts, ...data.allPosts]);
        if (data.allPosts.length < data.limit) {
          setHasMoreItems(false);
        }
      }
      setSkip(data.skip);
    }

    if (isError) {
      setAlertText(error?.data?.message?.general || error?.data?.message);
      setAlertType("error");
    }
  }, [isSuccess, isError]);


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

  const fetchItems = async () => {
    if (hasMoreItems && !isLoading) {
      const body = {
        skip,
        active,
        coordinateStatus
      };

      await getAllPost(body);
    }
  };

  const selectPost = (post) => {
    setSelected(post);
    setActionType("");
    setOpen(true);
  };

  const onUpdateModalClose = () => {
    setSelected({});
    setActionType("");
    setOpen(false);
  }

  const editCoors = (post) => {
    setSelected(post);
    setOpenCoorModal(true);
  };

  // const handleSaveAction = (e) => {
  //   e.preventDefault();
  //   if (actionType == "") {
  //     setErrorMsg("Please select action type ");
  //   } else if (selected?.name == undefined || selected?.name == "") {
  //     setAlertText("Please choose the post first");
  //     setAlertType("error");
  //     setShowAlert(true);
  //     setOpen(false);
  //   } else {
  //     const body = {
  //       post_id: selected._id,
  //       action: actionType,
  //     };

  //     updatePostStatus(body);
  //     setOpen(false);
  //   }
  // };

  const updatePostData = (updatedPost) => {
    const newPosts = posts.map(post => {
      if (post._id.toString() === selected._id.toString()){
        setSelected(updatedPost);
        return { ...post, ...updatedPost }
      }else{
        return post
      }
    })
    setPosts(newPosts);
  }

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
      {isLoading && firstFetch || REDUX_SERVERREQUEST.loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl my-2">
              Total Posts Showing:{" "}
              <span className="font-bold">{posts.length}</span>
            </h1>
            <h1 className="text-2xl my-2">
              Total:{" "}
              <span className="font-bold">{totalPost}</span>
            </h1>

          </div>

          {/* FILTERS */}
          <div className="flex justify-start items-start gap-8 py-4">
            <div className="flex justify-start items-center gap-2">
              <label>Status: </label>
              <select
                className="px-2 py-[0.25rem] bg-white border-[1px] border-gray-500"
                onChange={(e) => setActive(e.target.value)}
                defaultValue={active}
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="silent">Silent</option>
                <option value="deactivated">Deactivated</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="flex justify-start items-center gap-2">
              <label>Cordinate Status: </label>
              <select
                className="px-2 py-[0.25rem] bg-white border-[1px] border-gray-500"
                onChange={(e) => setCoordinateStatus(e.target.value)}
                defaultValue={coordinateStatus}
              >
                <option value="">Select</option>
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>
            <button className="px-2 py-[0.25rem] border-[1px] border-gray-400" onClick={filterSearch}>Search</button>
            <button className="px-2 py-[0.25rem] border-[1px] border-gray-400" onClick={clearFilter}>Clear Filter</button>
          </div>

          <div
            // className="lg:columns-4 md:columns-3 columns-1 md:gap-4 gap-1 h-full">
            className="grid lg:grid-cols-6 md:grid-cols-2  md:gap-4 grid-cols-1 gap-2 h-full"
          >
            {posts.map((post) => {
              return (
                <PostCard post={post} key={post._id} selectPost={selectPost} />
                // <div
                //   className="justify-center mb-2 bg-gray-100 p-2 w-full block"
                //   key={post._id}
                // >
                //   <button key={post._id} onClick={() => selectPost(post)}>
                //     <Image
                //       src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`}
                //       height={400}
                //       width={400}
                //       objectFit="cover"
                //     />
                //   </button>
                //   <h2 className="font-bold">{post?.user?.name}</h2>
                //   <h2 className="font-bold">{post?.place?.name}</h2>
                //   <h2>
                //     Status:{" "}
                //     <span className={`${post?.status == "active" && "font-bold text-red-600"}`}>
                //       {post?.status.charAt(0).toUpperCase()}{post?.status.slice(1)}
                //     </span>
                //   </h2>
                //   {/* <div>
                //     <h2>
                //       Status:{" "}
                //       <span
                //         className={`font-bold ${post.status == "active"
                //           ? "text-green-800"
                //           : "text-blue-800"
                //           }`}
                //       >
                //         {post?.status}
                //       </span>
                //     </h2>
                //     <Link href={`/admin/post/details/${post._id}`}>
                //       <button className="w-full bg-green-700 text-white rounded p-1 mt-2">
                //         View Details
                //       </button>
                //     </Link>
                //   </div> */}
                //   <h2 className="flex justify-start items-center">
                //     Recommend:{" "}
                //     <span
                //       className={`ml-1 ${post?.recommend
                //         ? "font-bold text-red-600"
                //         : ""
                //         }`}
                //     >
                //       {post?.recommend ? " True" : " False"}
                //     </span>
                //   </h2>
                //   <h2 className="flex justify-start items-center">
                //     Coordinates:{" "}
                //     <span
                //       className={`ml-1 ${post?.coordinate_status
                //         ? "font-bold text-red-600"
                //         : ""
                //         }`}
                //     >
                //       {post?.coordinate_status ? " True" : " False"}
                //     </span>
                //     {/* <button className="ml-2" onClick={() => editCoors(post)}>
                //       <SettingsIcon className="text-[1.2rem]" />
                //     </button> */}
                //   </h2>
                  
                //   <h2 className="flex justify-start items-center">
                //     Verified Coordinates:{" "}
                //     <span
                //       className={`ml-1 ${post?.verified_coordinates
                //         ? "font-bold text-red-600"
                //         : ""
                //         }`}
                //     >
                //       {post?.verified_coordinates ? " True" : " False"}
                //     </span>
                //   </h2>

                //   <h2 className="flex justify-start items-center">
                //     Manual Coordinates:{" "}
                //     <span
                //       className={`ml-1 ${post?.manual_coordinates
                //         ? "font-bold text-red-600"
                //         : ""
                //         }`}
                //     >
                //       {post?.manual_coordinates ? " True" : " False"}
                //     </span>
                //   </h2>
                  
                // </div>
              );
            })}
          </div>
        </div>
      )}

      {selected?.name && <UpdateModal open={open} onModalClose={onUpdateModalClose} selected={selected} updateSelected={updatePostData} />}

      {/* <Modal
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
            </div>
          </Box>
        </Fade>
      </Modal> */}

      {/* MODAL FOR ADDING?EDITING COORDINATES */}
      <Modal
        open={openCoorModal}
        onClose={() => {
          // setSelected({});
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
      {!hasMoreItems ? (
        <div className="text-center p-5">
          <Typography variant="subtitle2">No More Post</Typography>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center p-5">
              <Typography variant="subtitle2">Loading...</Typography>
            </div>
          ) : (
            <div className="flex justify-center align-middle p-5">
              <Button
                variant="contained"
                color="success"
                className="bg-teal-700"
                onClick={fetchItems}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
      <div>
        <Typography variant="subtitle1" className="p-5">
          Total Posts Showing: {posts.length}
        </Typography>
      </div>
    </Layout>
  );
};

export default AllPost;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
