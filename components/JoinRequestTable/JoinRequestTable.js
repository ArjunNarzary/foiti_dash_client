import {
  Backdrop,
  Box,
  CircularProgress,
  Modal,
  Typography,
  Fade,
} from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Router from "next/router";
import {
  useJoinRequestActionMutation,
  useViewJoinRequestQuery,
} from "../../Redux/services/servicesApi";
import TransitionAlerts from "../Alert/Alert";
import Moment from "react-moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  zIndex: 20,
};

const dropDownOptions = [
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
];

const JoinRequestTable = () => {
  const [requestData, setRequestData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [serverError, setServerError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const { data, error, isSuccess, isError, isLoading } =
    useViewJoinRequestQuery();
  const [
    joinRequestAction,
    {
      data: actionData,
      error: actionError,
      isSuccess: actionIsSuccess,
      isError: actionIsError,
      isLoading: actionIsLoading,
    },
  ] = useJoinRequestActionMutation();

  useEffect(() => {
    if (isSuccess) {
      setRequestData(data.joinRequest);
      setSearchData(data.joinRequest);
    }
    if (isError) {
      setServerError(error);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (actionIsSuccess) {
      setActionType("");
      setOpen(false);
      setSelectedRow({});
      setAlertText(actionData.message);
      setAlertType("success");
      setShowAlert(true);
      Router.reload(window.location.pathname);
    }
    if (actionIsError) {
      setAlertText(
        actionError.message.general || "Something went please try again"
      );
      setAlertType("error");
      setShowAlert(true);
      Router.reload(window.location.pathname);
    }
  }, [actionIsSuccess, actionIsError]);

  //Seach Email
  useEffect(() => {
    const result = requestData.filter((item) => {
      return item.email.toLowerCase().includes(search.toLowerCase());
    });
    setSearchData(result);
  }, [search]);

  //Handling Action
  const handleAction = (item) => {
    setSelectedRow(item);
    setOpen(true);
  };

  //Handle Action
  const handleSaveAction = () => {
    const body = {
      id: selectedRow._id,
      actionType: actionType,
    };
    joinRequestAction(body);
    setOpen(false);
  };

  //Status Styles
  const statusStyle = (item) => {
    if (item == "approved") {
      return {
        width: "5rem",
        color: "white",
        backgroundColor: "green",
      };
    } else if (item == "pending") {
      return {
        width: "5rem",
        color: "white",
        backgroundColor: "#f09a11",
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
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Facebook",
      selector: (row) => row.facebook,
      sortable: true,
    },
    {
      name: "Instagram",
      selector: (row) => row.instagram,
      sortable: true,
    },
    {
      name: "Twitter",
      selector: (row) => row.twitter,
      sortable: true,
    },
    {
      name: "Youtube",
      selector: (row) => row.youtube,
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span>
          <Moment parse="YYYY-MM-DD HH:mm">{row.createdAt}</Moment>
        </span>
      ),
      sortable: true,
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
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <button
            disabled={row.status != "pending"}
            className="bg-red-500 px-2 py-1 rounded text-white"
            onClick={() => handleAction(row)}
          >
            Take Action
          </button>
        );
      },
    },
  ];

  return (
    <>
      <TransitionAlerts
        text={alertText}
        alertType={alertType}
        showAlert={showAlert}
      />
      {isLoading || actionIsLoading ? (
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
          keyField={searchData._id}
          title="Join Request"
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
              placeholder="Search Email"
              className="p-1 w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        />
      )}

      <Modal
        open={open}
        onClose={() => {
          setSelectedRow({});
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
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              TAKE ACTION
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              EMAIL ADDRESS : {selectedRow.email}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              CURRENT STATUS : {selectedRow.status}
            </Typography>
            <div className="mt-2">
              <select
                name="select"
                className={`w-full bg-gray-200 rounded p-1 border-[0.1rem]`}
                onChange={(e) => {
                  setActionType(e.target.value);
                }}
              >
                <option>Take Action</option>
                {dropDownOptions.map((op, index) => {
                  return (
                    <option key={index} value={op.value}>
                      {op.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSaveAction}
                className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
              >
                Save
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default JoinRequestTable;
