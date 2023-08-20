import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: false,
    errorMsg: ""
}

export const serverRequestSlice = createSlice({
    name: "SERVERREQUEST",
    initialState,
    reducers: {
        setServerLoading: (state, action) => {
            state.loading = action.payload
        },
        setServerError: (state, action) => {
            console.log("action", action);
            state.error = action.payload.error;
            state.errorMsg = action.payload.errorMsg;
        },

        resetServerRequest: (state) => (state = initialState),
    }
});

export const { setServerLoading, setServerError, resetServerRequest } = serverRequestSlice.actions;

export default serverRequestSlice.reducer;