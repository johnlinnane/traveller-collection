import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Info } from '../types';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

interface InfosState {
    updateInfoTextSuccess?: boolean;
    infoText?: string;
    text?: string;
}

const initialState: InfosState = {};

const infosSlice = createSlice({
    name: "infos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateInfoText.fulfilled, (state, action: PayloadAction<{ success: boolean; doc: string }>) => {
                state.updateInfoTextSuccess = action.payload.success;
                state.infoText = action.payload.doc;
            })
            .addCase(getInfoText.fulfilled, (state, action: PayloadAction<string>) => {
                state.text = action.payload;
            });
    },
});

export const updateInfoText = createAsyncThunk(
    'infos/updateInfoText',
    async (info: Info) => {
        const response = await axios.post(`${API_PREFIX}/update-info-text`, info);
        return response.data; // The API is expected to return { success: boolean, doc: string }
    }
);

export const getInfoText = createAsyncThunk(
    'infos/getInfoText',
    async () => {
        const response = await axios.get(`${API_PREFIX}/get-info-text`);
        return response.data; // The API is expected to return a string
    }
);

export default infosSlice.reducer;
