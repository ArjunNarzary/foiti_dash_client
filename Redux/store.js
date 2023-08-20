import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import AddPlaceReducer from "./slices/addPlaceSlice";
import serverRequestReducer from "./slices/serverRequestSlice";

//APIS
import { serviceApi } from "./services/servicesApi";

const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    AUTHUSER: authReducer,
    NEWPLACE: AddPlaceReducer,
    SERVERREQUEST: serverRequestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceApi.middleware),
});

setupListeners(store.dispatch);

export default store;
