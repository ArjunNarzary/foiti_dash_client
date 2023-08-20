import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import moment from "moment";
import { useGetAllPlacesQuery } from "../../Redux/services/servicesApi";

const dropValues = [
  {
    value: "",
    label: "Select",
  },
  {
    value: "name",
    label: "Name",
  },
  {
    value: "locality",
    label: "Locality",
  },
  {
    value: "sublocality",
    label: "Sub-locality",
  },
  {
    value: "admin_area_2",
    label: "Admin_1",
  },
  {
    value: "admin_area_1",
    label: "Admin_2",
  },
];

const PlaceList = () => {
  const [requestData, setRequestData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [serverError, setServerError] = useState("");
  const [searchType, setSearchType] = useState("");
  const [filterDuplicate, setFilterDuplicate] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [search, setSearch] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data, error, isSuccess, isError, isLoading } = useGetAllPlacesQuery();

  //GET ALL USERS
  useEffect(() => {
    if (isSuccess) {
      setRequestData(data?.places);
      setSearchData(data?.places);
    }
    if (isError) {
      setServerError(error?.message?.general);
    }
  }, [isSuccess, isError]);

  //Search Name
  useEffect(() => {
    const result = requestData.filter((item) => {
      if (
        searchType != "name" &&
        searchType != "" &&
        item?.display_address?.hasOwnProperty(searchType)
      ) {
        return item.display_address[searchType]
          .toLowerCase()
          .includes(search.toLowerCase());
      } else {
        return item?.name?.toLowerCase().includes(search.toLowerCase());
      }
    });
    setSearchData(result);
  }, [search]);

  useEffect(() => {
    let filteredPlaces = [...requestData];
    if (filterDestination != "") {
      if (filterDestination == "true") {
        filteredPlaces = filteredPlaces.filter(
          (item) => item.destination === true
        );
      } else {
        filteredPlaces = filteredPlaces.filter(
          (item) => item.destination !== true
        );
      }
    }

    if (filterDuplicate != "") {
      if (filterDuplicate == "true") {
        filteredPlaces = filteredPlaces.filter(
          (item) => item.duplicate === true
        );
      } else {
        filteredPlaces = filteredPlaces.filter(
          (item) => item.duplicate !== true
        );
      }
    }

    if (filterCountry != "") {
      filteredPlaces = filteredPlaces.filter((item) => {
        if (item?.display_address?.hasOwnProperty("country")) {
          return item.display_address.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        }
      });
    }

    setSearchData(filteredPlaces);
  }, [filterDestination, filterDuplicate, filterCountry]);

  const clearFilter = () => {
    setFilterCountry("");
    setFilterDuplicate("");
    setFilterDestination("");
  };

  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "4rem",
    },
    {
      name: "name",
      selector: (row) => row.name,
      cell: (row) => (
        <a
          className="hover:text-blue-800 hover:font-bold"
          href={`/place/${row._id}`}
        >
          {row.name}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Posts",
      selector: (row) => row.posts.length,
      sortable: true,
      width: "7rem",
    },
    // {
    //   name: "Duplicate",
    //   selector: (row) => row.duplicate,
    //   sortable: true,
    //   cell: (row) => <span>{row.duplicate ? "True" : "False"}</span>,
    // },
    {
      name: "Type 0",
      selector: (row) => row.types[0],
      sortable: true,
    },
    {
      name: "Type 1",
      selector: (row) => row.types[1],
      sortable: true,
    },
    {
      name: "Sub Locality",
      selector: (row) => row?.display_address?.sublocality,
      sortable: true,
    },
    {
      name: "Locality",
      selector: (row) => row?.display_address?.locality,
      sortable: true,
    },
    {
      name: "Admin_area_2",
      selector: (row) => row?.display_address?.admin_area_2,
      sortable: true,
    },
    {
      name: "Admin_area_1",
      selector: (row) => row?.display_address?.admin_area_1,
      sortable: true,
    },
    // {
    //   name: "Destination",
    //   selector: (row) => row.destination,
    //   sortable: true,
    //   cell: (row) => <span>{row.destination ? "True" : "False"}</span>,
    // },
    // {
    //   name: "Country",
    //   selector: (row) => row?.display_address?.country,
    //   sortable: true,
    //   width: "8rem",
    // },
    {
      name: "Created On",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span>{moment(row.createdAt).format("MMMM DD YYYY h:mm:ss a")}</span>
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
          <div className="flex justify-between align-middle">
            <Typography variant="h4">Place List</Typography>
            <button className="border-2 px-10 rounded" onClick={clearFilter}>
              Clear Filter
            </button>
          </div>
          <div className="flex justify-between align-middle mt-4">
            <div>
              <select
                className="border-[2px] w-[100px] p-1"
                onChange={(e) => {
                  setSearchType(e.target.value);
                }}
                value={searchType}
              >
                {dropValues.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search"
                className="ml-1 border-[2px] w-[300px] p-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex justify-between align-middle">
              <div>
                <label>Duplicate: </label>
                <select
                  className="ml-1 border-[2px] w-[100px] p-1"
                  onChange={(e) => setFilterDuplicate(e.target.value)}
                  value={filterDuplicate}
                >
                  <option value="">Select</option>
                  <option value={true}>True</option>
                  <option value={false}>Fasle</option>
                </select>
              </div>
              <div className="ml-4">
                <label>Destination: </label>
                <select
                  className="ml-1 border-[2px] w-[100px] p-1"
                  onChange={(e) => setFilterDestination(e.target.value)}
                  value={filterDestination}
                >
                  <option value="">Select</option>
                  <option value={true}>True</option>
                  <option value={false}>Fasle</option>
                </select>
              </div>
              <div className="ml-4">
                <label>Country: </label>
                <input
                  type="text"
                  placeholder="Enter"
                  className="ml-1 border-[2px] w-[300px] p-1"
                  onChange={(e) => setFilterCountry(e.target.value)}
                  value={filterCountry}
                />
              </div>
            </div>
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
          />
        </>
      )}
    </>
  );
};

export default PlaceList;
