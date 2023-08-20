import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  place_id: "",
  types: [],
  place_id: "",
  address: {},
  coordinates: {},
  timing: [],
  phone_number:""
};

export const addPlaceSlice = createSlice({
  name: "NEWPLACE",
  initialState,
  reducers: {
    addPlaceData: (state, action) => {
      state.name = action.payload.name;
      state.place_id = action.payload.place_id;
      state.types = action.payload.types;
      state.address = action.payload.address;
      state.coordinates = action.payload.coordinates;
      state.timing = action.payload.timing;
      state.phone_number = action.payload.phone_number;
    },
    removePlaceData: (state) => (state = initialState),
  },
});

export const { addPlaceData, removePlaceData } = addPlaceSlice.actions;

export default addPlaceSlice.reducer;
