import { Backdrop, Divider, Fade, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment/moment";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "rgba(255, 255, 240, 0.9)",
    overflowY: "scroll",
    boxShadow: 24,
    p: 5,
    zIndex: 20,
    height: "auto",
    maxHeight: '95vh',
    pb: 15,
};

const TripDetailModal = ({
    openDetailModal,
    closeDetailModal,
    tripPlan,
}) => {
    return (
        <Modal
            open={openDetailModal}
            onClose={closeDetailModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={openDetailModal}>
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="text-center"
                    >
                        Trip Plan Details
                    </Typography>
                    <div className="grid grid-cols-6 mt-2 gap-y-1">
                        <label className="font-bold">About Trip</label>
                        <h6 className="col-span-5">{tripPlan?.details}</h6>

                        <label className="font-bold">Start Date</label>
                        <h6 className="col-span-5">{moment(tripPlan?.start_date).format("DD/MM/YYYY")}</h6>

                        <label className="font-bold">End Date</label>
                        <h6 className="col-span-5">{moment(tripPlan?.end_date).format("DD/MM/YYYY")}</h6>

                        <label className="font-bold">Address</label>
                        <h6 className="col-span-5">
                            {tripPlan?.address?.name && Object.keys(tripPlan?.address).map(
                                (key, index) => {
                                    return (
                                        <p key={index}>
                                            <span className="font-bold">{key}</span> :{" "}
                                            {tripPlan?.address[key]}
                                        </p>
                                    );
                                }
                            )}
                        </h6>

                        <label className="font-bold">Destination</label>
                        <h6 className="col-span-5">
                            {tripPlan?.destination?.name && Object.keys(tripPlan?.destination).map(
                                (key, index) => {
                                    return (
                                        <p key={index}>
                                            <span className="font-bold">{key}</span> :{" "}
                                            {tripPlan?.destination[key]}
                                        </p>
                                    );
                                }
                            )}
                        </h6>
                        <Divider className="col-span-6 mt-3" />
                        <h3 className="col-span-6 text-center font-bold text-lg py-2">User Details</h3>

                        <label className="font-bold">Name</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.name}</h6>

                        <label className="font-bold">Email</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.email}</h6>

                        <label className="font-bold">Gender</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.gender}</h6>

                        <label className="font-bold">DOB</label>
                        <h6 className="col-span-5">{Math.floor(moment().diff(tripPlan?.user_id?.dob, 'years', true))}</h6>

                        <label className="font-bold">Bio</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.bio}</h6>

                        <label className="font-bold">Interest</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.interests}</h6>

                        <label className="font-bold">Education</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.education}</h6>

                        <label className="font-bold">Occupation</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.occupation}</h6>

                        <label className="font-bold">Languages</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.languages.join(", ")}</h6>

                        <label className="font-bold">Movies, Books & Music</label>
                        <h6 className="col-span-5">{tripPlan?.user_id?.movies_books_music}</h6>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default TripDetailModal;
