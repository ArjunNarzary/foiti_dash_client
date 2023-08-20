import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { useGetAllTripPlansQuery, useUpdateTripPlanStatusMutation } from "../../Redux/services/servicesApi";
import TripDetailModal from "./TripDetailModal";

const PlanList = () => {
    const [trips, setTrips] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [serverError, setServerError] = useState("");
    const [search, setSearch] = useState("");
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});
    const [showModal, setShowModal] = useState(false);

    const { data, error, isSuccess, isError, isLoading } = useGetAllTripPlansQuery();
    const [ updateTripPlanStatus, {
        data: updateData,
        error: updateError,
        isSuccess: updateIsSuccess,
        isError: updateIsError,
        isLoading: updateIsLoading
    } ] = useUpdateTripPlanStatusMutation();

    //GET ALL Plans
    useEffect(() => {
        if (isSuccess) {
            setTrips(data?.plans);
            setSearchData(data?.plans);
        }
        if (isError) {
            setServerError(error?.message?.general);
        }
    }, [isSuccess, isError]);

    useEffect(() => {
        if (updateIsSuccess) {
            const newTrips = trips.map(item => {
                if(item._id == updateData?.plan?._id){
                    return {
                        ...item,
                        status: updateData?.plan?.status
                    }
                }else{
                    return item;
                }
            })
            if(newTrips.length > 0){
                setTrips(newTrips);
            }

            const newSearchData = searchData.map(item => {
                if(item._id == updateData?.plan?._id){
                    return {
                        ...item,
                        status: updateData?.plan?.status
                    }
                }else{
                    return item;
                }
            })


            if(newSearchData.length > 0){
                setSearchData(newSearchData);
            }
        }
        if (updateIsError) {
            console.log(updateError);
            setServerError(updateError?.message?.general);
        }
    }, [updateIsSuccess, updateIsError]);


    //Search Name
    useEffect(() => {
        if(search.length > 0){
            const result = trips.filter((item) => {
                return item?.user_id?.name?.toLowerCase().includes(search.toLowerCase());
            });
            setSearchData(result);
        }else{
            setSearchData(trips);
        }
    }, [search]);

    //CHANGE TRIP PLAN STATUS
    const changePlanStatus = (row, action) => {
        if(!action) return;
        searchData.map((item) => {
            if (item._id == row._id && item.status != action){
                const payload = {
                    trip_id: row._id,
                    action
                }
                updateTripPlanStatus(payload)
            }
        })
    }

    //Handle modal show
    const handleModalShow = (plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
    }

    //Close Modal
    const closeDetailModal = () => {
        setShowModal(false);
        setSelectedPlan({})
    }

    //Status Styles
    const statusStyle = (item) => {
        if (item == "active") {
            return {
                width: "5rem",
                color: "white",
                backgroundColor: "green",
            };
        } else if (item == "silent") {
            return {
                width: "5rem",
                color: "black",
                backgroundColor: "grey",
            };
        } else {
            return {
                width: "5rem",
                color: "white",
                backgroundColor: "red",
            };
        }
    };

    const columns = [
        {
            name: "Sl No",
            selector: (row, index) => index + 1,
            width: "4rem",
        },
        {
            name: "Name",
            selector: (row) => row?.user_id?.name,
            cell: (row) => (
                <a className="hover:text-blue-800 hover:font-bold" href="#" onClick={() => handleModalShow(row)}>
                    {row?.user_id?.name}
                </a>
            ),
            sortable: true,
            wrap: true
        },
        {
            name: "Address",
            selector: (row) => row?.address?.name,
            sortable: true,
            wrap: true,
            grow: 1
        },
        {
            name: "Destination",
            selector: (row) => row?.destination?.name,
            sortable: true,
            wrap: true,
            grow: 1
        },
        {
            name: "Start Date",
            selector: (row) => row.start_date,
            cell: (row) => (
                <span>
                    {moment(row.start_date).format("DD/MM/YYYY")}
                </span>
            ),
            sortable: true,
            wrap: true,
            grow: 1
        },
        {
            name: "End Date",
            selector: (row) => row.end_date,
            cell: (row) => (
                <span>
                    {moment(row.end_date).format("DD/MM/YYYY")}
                </span>
            ),
            sortable: true,
            wrap: true,
            grow: 1
        },
        // {
        //     name: "Details",
        //     selector: (row) => row.details,
        //     sortable: true,
        //     width: "7rem",
        //     cell: (row) => (
        //         <span>
        //             {row?.details}
        //         </span>
        //     ),
        // },
        {
            name: "Meetup Status",
            selector: (row) => row.meetup_status,
            sortable: true,
            width: "7rem",
            cell: (row) => (
                <span
                    className={`px-2 text-white rounded ${row.meetup_status ? "bg-green-600" : "bg-red-700"
                        }`}
                >
                    {row.meetup_status ? "True" : "False"}
                </span>
            ),
        },
        {
            name: "Created On",
            selector: (row) => row.createdAt,
            cell: (row) => (
                <span>
                    {moment(row.createdAt).format("DD/MM/YYYY")}
                </span>
            ),
            sortable: true,
            width: "7rem",
        },
        {
            name: "Status",
            selector: (row) => row.status,
            cell: (row) => (
                <button
                    disabled={true}
                    className="py-1 rounded"
                    style={statusStyle(row.status)}
                >
                    {row.status}
                </button>
            ),
            sortable: true,
            width: "7rem",
        },
        {
            name: "Action",
            cell: (row) => (
                <select onChange={(e) => changePlanStatus(row, e.target.value)}>
                    <option value="">Change Status</option>
                    <option value="active">Active</option>
                    <option value="silent">Silent</option>
                    <option value="terminated">Terminate</option>
                </select>
            ),
            sortable: true,
        },
    ];

    return (
        <>
            <TransitionAlerts
                text={alertText}
                alertType={alertType}
                showAlert={showAlert}
            />
            {isLoading ? (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                        {updateIsLoading &&
                            <Backdrop
                                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={true}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        }
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl">Trip Plans</h1>
                        <h1 className="text-2xl">
                            Total:
                            <span className="font-bold"> {trips.length}</span>
                        </h1>
                    </div>
                    <DataTable
                        columns={columns}
                        data={searchData}
                        striped={true}
                        highlightOnHover={true}
                        sortServer={false}
                        pagination
                        paginationPerPage="50"
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        fixedHeader={true}
                        subHeader
                        subHeaderComponent={
                            <input
                                type="text"
                                placeholder="Search Name"
                                className="p-1 w-1/3"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        }
                    />
                    <TripDetailModal
                        openDetailModal={showModal}
                        closeDetailModal ={closeDetailModal}
                        tripPlan = {selectedPlan}
                    />
                </>
            )}
        </>
    );
};

export default PlanList;
