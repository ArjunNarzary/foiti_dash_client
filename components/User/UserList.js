import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import {
  useAllUsersQuery,
  useCalculateContributionMutation,
  useChangeUserStatusMutation,
  useUpdateMeetupProfileHiddenStatusMutation,
} from "../../Redux/services/servicesApi";
import { LoadingButton } from "@mui/lab";
import moment from "moment";

const UserList = () => {
  const [requestData, setRequestData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [serverError, setServerError] = useState("");
  const [search, setSearch] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data, error, isSuccess, isError, isLoading } = useAllUsersQuery();
  const [
    changeUserStatus,
    {
      data: userData,
      error: userError,
      isSuccess: userIsSuccess,
      isError: userIsError,
      isLoading: userIsLoading,
    },
  ] = useChangeUserStatusMutation();

  const [
    updateMeetupProfileHiddenStatus,
    {
      data: meetupProfileData,
      error: meetupProfileError,
      isSuccess: meetupProfileIsSuccess,
      isError: meetupProfileIsError,
      isLoading: meetupProfileIsLoading,
    },
  ] = useUpdateMeetupProfileHiddenStatusMutation();

  const [
    calculateContribution,
    {
      data: contributionData,
      error: contributionError,
      isSuccess: contributionIsSuccess,
      isError: contributionIsError,
      isLoading: contributionIsLoading,
    },
  ] = useCalculateContributionMutation();

  //GET ALL USERS
  useEffect(() => {
    if (isSuccess) {
      setRequestData(data?.users);
      setSearchData(data?.users);
    }
    if (isError) {
      setServerError(error?.message?.general);
    }
  }, [isSuccess, isError]);

  //UPDATE CONTRIBUTIONS
  useEffect(() => {
    if (contributionIsSuccess) {
      const newData = searchData.map((item) => {
        if (item._id == contributionData?.user?._id) {
          return {
            ...item,
            total_contribution: contributionData?.user?.total_contribution,
          };
        }

        return item;
      });
      setSelectedId("");
      setSearchData(newData);
    }
    if (contributionIsError) {
      setAlertText(
        contributionError?.message?.general || "Something went please try again"
      );
      setAlertType("error");
      setShowAlert(true);
    }
  }, [contributionIsSuccess, contributionIsError]);

  //CHANGE USER STATUS IN DATATABLE
  useEffect(() => {
    if (userIsSuccess) {
      const newData = searchData.map((item) => {
        if (item._id == userData?.user?._id) {
          return {
            ...item,
            account_status: userData?.user?.account_status,
          };
        }

        return item;
      });
      setSearchData(newData);
    }
    if (userIsError) {
      setAlertText(
        userError?.message?.general || "Something went please try again"
      );
      setAlertType("error");
      setShowAlert(true);
    }
  }, [userIsSuccess, userIsError]);


  //CHANGE USER MEETUP STATUS IN DATATABLE
  useEffect(() => {
    if (meetupProfileIsSuccess) {
      const newData = searchData.map((item) => {
        if (item._id == meetupProfileData?.user?._id) {
          return {
            ...item,
            hidden_meetup_profile: meetupProfileData?.user?.hidden_meetup_profile,
          };
        }

        return item;
      });
      setSearchData(newData);
    }
    if (meetupProfileIsError) {
      setAlertText(
        meetupProfileIsError?.message?.general || "Something went please try again"
      );
      setAlertType("error");
      setShowAlert(true);
    }
  }, [meetupProfileIsSuccess, meetupProfileIsError]);

  //Search Name
  useEffect(() => {
    const result = requestData.filter((item) => {
      return item?.name?.toLowerCase().includes(search.toLowerCase());
    });
    setSearchData(result);
  }, [search]);

  //Chnage Action Status
  const changeAccountStatus = (row, action) => {
    if (action == "") return;
    searchData.map((item) => {
      if (item._id === row._id && item.account_status[0] != action) {
        data = {
          user_id: row._id,
          action,
        };
        changeUserStatus(data);
      }
    });
  };


  //Chnage hidden meetup profile status
  const changeMeetupProfile = (row, action) => {
    if (action == "") return;
    searchData.map((item) => {
      if (item._id === row._id && item.account_status[0] != action) {
        data = {
          user_id: row._id,
          action,
        };
        updateMeetupProfileHiddenStatus(data);
      }
    });
  };

  //Hnadle Recalculate Contributions
  const handleRecalculateContribution = async (row) => {
    if (row._id) {
      setSelectedId(row._id);
      const data = {
        user_id: row._id,
      };
      calculateContribution(data);
    }
  };

  //Status Styles
  const statusStyle = (item) => {
    if (item == "active") {
      return {
        width: "5rem",
        color: "white",
        backgroundColor: "green",
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
      selector: (row) => row.name,
      cell: (row) => (
        <a className="hover:text-blue-800 hover:font-bold" href="#">
          {row.name}
        </a>
      ),
      sortable: true,
      wrap:true
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
      name: "Address",
      selector: (row) => row.formattedAddress,
      sortable: true,
      wrap: true,
      grow: 1
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true, 
      wrap:true,
      grow: 1
    },
    {
      name: "Email Verified",
      selector: (row) => row.email_verified,
      sortable: true,
      width: "7rem",
      cell: (row) => (
        <span
          className={`px-2 text-white rounded ${
            row.email_verified ? "bg-green-600" : "bg-red-700"
          }`}
        >
          {row.email_verified ? "True" : "False"}
        </span>
      ),
    },
    {
      name: "Followers",
      selector: (row) => row.follower.length,
      sortable: true,
      width: "7rem",
    },
    {
      name: "Following",
      selector: (row) => row.following.length,
      sortable: true,
      width: "7rem",
    },
    {
      name: "Contributions",
      selector: (row) => row.total_contribution,
      sortable: true,
      width: "7rem",
    },

    {
      name: "Account Status",
      selector: (row) => row.account_status,
      cell: (row) => (
        <button
          disabled={true}
          className="py-1 rounded"
          style={statusStyle(row.account_status)}
        >
          {row.account_status}
        </button>
      ),
      sortable: true,
      width: "7rem",
    },
    // {
    //   name: "Recalculate Contributions",
    //   cell: (row) => (
    //     <LoadingButton
    //       loading={selectedId == row._id ? contributionIsLoading : false}
    //       onClick={(e) => handleRecalculateContribution(row)}
    //       className="w-full bg-green-600 text-white rounded py-1 hover:bg-green-500 capitalize"
    //     >
    //       Recalculate
    //     </LoadingButton>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <select onChange={(e) => changeAccountStatus(row, e.target.value)}>
          <option value="">Change Status</option>
          <option value="active">Active</option>
          <option value="silent">Silent</option>
        </select>
      ),
      sortable: true,
    },
    {
      name: "Hidden Meetup Profile",
      cell: (row) => (
        <div className="text-center">
          <span
            className={`block px-2 text-white rounded ${row.hidden_meetup_profile ? "bg-green-600" : "bg-red-700"
              }`}
          >
            {row.hidden_meetup_profile ? "True" : "False"}
          </span>
          <select onChange={(e) => changeMeetupProfile(row, e.target.value)}>
            <option value="">Change Status</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
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
      {isLoading || userIsLoading || meetupProfileIsLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Users</h1>
          <h1 className="text-2xl">
            Total: 
                <span className="font-bold"> {requestData.length}</span>
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
        </>
      )}
    </>
  );
};

export default UserList;
