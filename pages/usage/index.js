import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import SessionList from "../../components/Usage/SessionList";
import { useGetSessionsMutation, useTotalUsersQuery } from "../../Redux/services/servicesApi";
import { requireAuthentication } from "../../resources/requireAuthentication";
import TransitionAlerts from "../../components/Alert/Alert";

const Usage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sessions, setSessions] = useState([]);
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);

    const [getSessions, { data, error, isLoading, isSuccess, isError }] = useGetSessionsMutation();
    const { data:userData, error:userError, isLoading:userIsLoading, isSuccess:userIsSuccess, isError:userIsError } = useTotalUsersQuery();


    useEffect(() => {
        if (isSuccess) {
            setSessions(data.sessions)
        }
        if (isError) {
            setAlertText(error?.data?.message)
            setAlertType("error");
            setShowAlert(true)
        }
    }, [isSuccess, isError])

    const getSessionData = () => {
        const data = {
            startDate,
            endDate
        }

        getSessions(data);
    }

    return (
        <Layout>
            <TransitionAlerts
                text={alertText}
                alertType={alertType}
                showAlert={showAlert}
            />
            <>
                {isLoading || userIsLoading ? (
                    <Backdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    <div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl">User Session</h1>
                                <h1 className="text-2xl">Total Users: <span className="font-semibold">{userData.totalUsers}</span></h1>
                        </div>
                        <div className="flex justify-start gap-4 items-center mt-4">
                            <h2>Date Range</h2>
                            <div>
                                <DatePicker
                                    className="border-2 border-gray-500 p-1"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    className="border-2 p-1  border-gray-500"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <button onClick={getSessionData} className="border-2 px-2 py-[0.25rem] border-gray-400 hover:bg-teal-500">Get Sessions</button>
                        </div>
                        <div>
                            <SessionList sessions={sessions} />
                        </div>
                    </div>
                )}
            </>
        </Layout>
    );
};

export default Usage;

export const getServerSideProps = requireAuthentication(async (ctx) => {
    return {
        props: {},
    };
});
