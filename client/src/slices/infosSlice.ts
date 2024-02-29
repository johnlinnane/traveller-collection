import { Info } from '../types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

// interface InfosState {
//     text: Info,
//     updateInfoTextSuccess: boolean, 
//     infoText: Info
// }

// const initialState: InfosState = {
//     text: {
//         item_id: '',
//         heading: '',
//         paragraph: ''
//     },
//     updateTextSuccess: false, 
//     infoText: {
//         title: '',
//         body: ''
//     }
// }

interface InfosState {}

const initialState: InfosState = {}

const infosSlice = createSlice({
    name: "infos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateInfoText.fulfilled, (state, action: PayloadAction<InfosState>) => {
                state.updateInfoTextSuccess = action.payload.success;
                state.infoText = action.payload.doc;
            })
            .addCase(getInfoText.fulfilled, (state, action: PayloadAction<InfosState>) => {
                state.text = action.payload;
            })
        }       
})






export const updateInfoText = createAsyncThunk(
    'infos/updateInfoText',
    async (data) => {
        const request = axios.post(`${API_PREFIX}/update-info-text`, data)
            .then(response => response.data);
        return request;
    }
);

export const getInfoText = createAsyncThunk(
    'infos/getInfoText',
    async () => {
        const request = axios.get(`${API_PREFIX}/get-info-text`)
            .then(response => response.data);
        return request;
    }
);


export default infosSlice.reducer;