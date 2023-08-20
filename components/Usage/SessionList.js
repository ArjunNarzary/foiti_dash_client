
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TransitionAlerts from "../Alert/Alert";
import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

//Format time
function formatTime(seconds){
    return moment.duration(seconds, "seconds").format();
}

const SessionList = ({ sessions }) => {
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);

    const columns = [
        {
            name: "Sl No",
            selector: (row, index) => index + 1,
            width: "4rem",
        },
        {
            name: "name",
            selector: (row) => row?.name,
            cell: (row) => (
                <a
                    className="hover:text-blue-800 hover:font-bold"
                    href={`/admin/post/${row?.user[0]?._id}`}
                >
                    {row?.user[0]?.name}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Created On",
            selector: (row) => row?.user[0]?.createdAt,
            cell: (row) => (
                <span>{moment(row?.user[0]?.createdAt).format("DD-MM-YYYY")}</span>
            ),
            sortable: true,
            width: "7rem",
        },
        {
            name: "Current App Version",
            selector: (row) => row.version,
            sortable: true,
        },
        {
            name: "Total Time",
            selector: (row) => row.totalSession,
            cell: (row) => (
                <span>{formatTime(row.totalSession)}</span>
            ),
            sortable: true,
        },
        {
            name: "Total Sessions",
            selector: (row) => row?.count,
            sortable: true,
        }
    ];

    return (
        <>
            <TransitionAlerts
                text={alertText}
                alertType={alertType}
                showAlert={showAlert}
            />
            <DataTable
                columns={columns}
                data={sessions}
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
    );
};

export default SessionList;
