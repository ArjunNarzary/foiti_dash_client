import { Backdrop, CircularProgress } from "@mui/material";
import { HourglassBottomSharp } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import { PencilAltIcon } from "@heroicons/react/outline";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
import {
  useDeleteTypeMutation,
  useGetAllTypesQuery,
} from "../../Redux/services/servicesApi";
import UpdateTypeModal from "./UpdateTypeModal";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const TypeList = () => {
  const [requestData, setRequestData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [serverError, setServerError] = useState("");
  const [search, setSearch] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedType, setSelectedType] = useState({});
  const [openUpdateTypeModal, setOpenUpdateTypeModal] = useState(false);

  const { data, error, isSuccess, isError, isLoading } = useGetAllTypesQuery();

  const [
    deleteType,
    {
      data: deletedData,
      error: deletedError,
      isSuccess: deletedIsSuccess,
      isError: deletedIsError,
      isLoading: deletedIsLoading,
    },
  ] = useDeleteTypeMutation();

  //GET ALL USERS
  useEffect(() => {
    if (isSuccess) {
      setRequestData(data?.types);
      setSearchData(data?.types);
    }
    if (isError) {
      setServerError(error?.message?.general);
    }
  }, [isSuccess, isError]);

  //DELETE TYPE
  useEffect(() => {
    if (deletedIsSuccess) {
      const newData = searchData.filter((item) => item._id != selectedType._id);
      setSearchData(newData);
      setRequestData(newData);
      setSelectedType({});
      setAlertText("Type has been deleted successfully");
      setAlertType("success");
      setShowAlert(true);
    }
    if (deletedIsError) {
      setSelectedType({});
      setAlertText("Type cannot be deleted. Please try again");
      setAlertType("error");
      setShowAlert(true);
    }
  }, [deletedIsSuccess, deletedIsError]);

  //CLOSE MODAL
  const closeUpdateTypeModal = () => {
    setOpenUpdateTypeModal(false);
    setSelectedType({});
  };

  //HANDLE TYPE ADDITION
  const addedType = (type) => {
    setSearchData([type, ...searchData]);
    setRequestData([type, ...searchData]);
    closeUpdateTypeModal();
    setAlertText("New type added successfully");
    setAlertType("success");
    setShowAlert(true);
  };

  //HANDLE TYPE UPDATION
  const updatedType = (type) => {
    const newData = searchData.map((item) => {
      if (item._id === type._id) {
        return type;
      }
      return item;
    });
    setSearchData(newData);
    setRequestData(newData);
    closeUpdateTypeModal();
    setAlertText("Type has been updated successfully");
    setAlertType("success");
    setShowAlert(true);
  };

  //HANDLE TYPE DELETION
  const handleDelete = (type) => {
    if (!type._id) {
      setAlertText("Type cannot be deleted. Please try again");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setSelectedType(type);
    const body = {
      type_id: type._id,
    };

    deleteType(body);
  };

  //Search Name
  useEffect(() => {
    const result = requestData.filter((item) => {
      return item?.display_type?.toLowerCase().includes(search.toLowerCase());
    });
    setSearchData(result);
  }, [search]);

  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "4rem",
    },
    {
      name: "Display Type",
      selector: (row) => row.display_type,
      cell: (row) => (
        <a className="hover:text-blue-800 hover:font-bold" href="#">
          {row.display_type}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      cell: (row) => (
        <span className={classNames(row.category ? "bg-green-800":"bg-red-800","text-white py-[0.15rem] px-[0.25rem] rounded-2xl")}>
          {row.category ? "true" : "false"}
        </span>
      ),
      sortable: true,
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
    },
    {
      name: "Last Updated",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span>
          {/* <Moment parse="dd/mm/YYYY">{row.updatedAt}</Moment> */}
          {moment(row.updatedAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Edit",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedType(row);
            setOpenUpdateTypeModal(true);
          }}
        >
          <PencilAltIcon className="h-6 w-6 text-blue-600" />
        </button>
      ),
      width: "6rem",
    },
    {
      name: "Delete",
      cell: (row) => (
        <button disabled={deletedIsLoading} onClick={() => handleDelete(row)}>
          {/* <TrashIcon className="h-6 w-6 text-red-700" /> */}
          {selectedType?._id == row?._id && deletedIsLoading ? (
            <HourglassBottomSharp className="h-6 w-6 text-yellow-500 animate-spin" />
          ) : (
            <TrashIcon className="h-6 w-6 text-red-700" />
          )}
        </button>
      ),
      width: "6rem",
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
          <div className="flex justify-end">
            <button
              onClick={() => setOpenUpdateTypeModal(true)}
              className="flex justify-center items-center text-white font-bold bg-green-600 hover:bg-green-500 transition-all px-5 py-2 rounded-md hover:rounded-sm"
            >
              <PlusIcon className="h-5 w-5" />
              ADD TYPE
            </button>
          </div>
          <DataTable
            columns={columns}
            data={searchData}
            title="Type List"
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
                placeholder="Search Displat Type"
                className="p-1 w-1/3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </>
      )}
      <UpdateTypeModal
        openUpdateTypeModal={openUpdateTypeModal}
        closeUpdateTypeModal={closeUpdateTypeModal}
        typeData={selectedType}
        addedType={addedType}
        updatedType={updatedType}
      />
    </>
  );
};

export default TypeList;

// openUpdateTypeModal,
//   closeUpdateTypeModal,
//   type = {},
//   updatedType,
//   addedType,
