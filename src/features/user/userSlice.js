/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to improve error handling and add getCurrentPosition timeout.
    NB: Not working for Firefox - Firefox bug that can't be addressed here.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
    // getCurrentPosition does not return a Promise
    // wrap it in a new Promise to use with async
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            const error = new Error("Browser does not support geolocation.");
            reject(error);
        }

        navigator.geolocation.getCurrentPosition(
            // Success callback
            resolve,
            // Failure callback
            reject,
            // Options
            { timeout: 5000 }, // Default timeout is infinity, must set something sane
        );
    });
}

export const fetchAddress = createAsyncThunk(
    "user/fetchAddress",
    async function () {
        // 1) We get the user's geolocation position
        const positionObj = await getPosition();
        const position = {
            latitude: positionObj.coords.latitude,
            longitude: positionObj.coords.longitude,
        };
        console.log("got position: ", position);

        // 2) Then we use a reverse geocoding API to get a description of the user's address,
        // so we can display it the order form, so that the user can correct it if wrong
        const addressObj = await getAddress(position);
        const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

        // 3) Then we return an object with the data that we are interested in
        // (will be payload of the fulfilled state)
        return { position, address };
    },
);

const initialState = {
    username: "",
    status: "idle",
    position: {},
    address: "",
    error: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateName(state, action) {
            state.username = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchAddress.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.position = action.payload.position;
                state.address = action.payload.address;
                state.status = "idle";
                state.error = "";
            })
            .addCase(fetchAddress.rejected, (state) => {
                state.status = "error";
                state.error =
                    "There was a problem getting your address. Make sure to fill this field!";
            }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
