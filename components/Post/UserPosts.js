import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import { useUserPostStatusQuery } from "../../Redux/services/servicesApi";

const UserPosts = () => {
  const [requestData, setRequestData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [serverError, setServerError] = useState("");
  const [search, setSearch] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const { data, error, isSuccess, isError, isLoading } =
    useUserPostStatusQuery();

  useEffect(() => {
    if (isSuccess) {
      setRequestData(data?.posts);
      setSearchData(data?.posts);
    }
    if (isError) {
      setServerError(error?.message?.general);
    }
  }, [isSuccess, isError]);

  //Seach Email
  useEffect(() => {
    const result = requestData.filter((item) => {
      return item.name[0].toLowerCase().includes(search.toLowerCase());
    });
    setSearchData(result);
  }, [search]);

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
      width: "5rem",
    },
    {
      name: "name",
      selector: (row) => row.name[0],
      cell: (row) => (
        <a
          className="hover:text-blue-800 hover:font-bold"
          href={`/admin/post/${row._id}`}
        >
          {row.name[0]}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Total Posts",
      selector: (row) => row.total_posts,
      sortable: true,
    },
    {
      name: "Active Posts",
      selector: (row) => row.total_active,
      sortable: true,
    },
    {
      name: "Active Percantage",
      selector: (row) =>
        ((row.total_active / row.total_posts) * 100).toFixed(2),
      sortable: true,
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
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <select onChange={(e) => changeAccountStatus(row, e.target.value)}>
    //       <option value="">Change Status</option>
    //       <option value="active">Active</option>
    //       <option value="silent">Silent</option>
    //     </select>
    //   ),
    //   sortable: true,
    // },
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
        <DataTable
          columns={columns}
          data={searchData}
          title="User Posts Details"
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
      )}
    </>
  );
};

export default UserPosts;
