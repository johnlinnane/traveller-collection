import { Intro } from '../types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // PayloadAction
import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

interface IntrosState {
    text: Intro,
    updateTextSuccess: boolean, 
    introText: Intro
}

const initialState: IntrosState = {
    text: {
        title: '',
        body: ''
    },
    updateTextSuccess: false, 
    introText: {
        title: '',
        body: ''
    }
}

const introsSlice = createSlice({
    name: "intros",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateIntroText.fulfilled, (state, action) => {
                state.updateTextSuccess = action.payload.success;
                state.introText = action.payload.doc;
            })
            .addCase(getIntroText.fulfilled, (state, action) => { // : PayloadAction<IntrosState>
                state.text = action.payload;
            })
            
    }
})

export const updateIntroText = createAsyncThunk(
    'intros/updateIntroText', 
    async (intro: Intro) => {
        const request = axios.post(`${API_PREFIX}/update-intro-text`, intro)
            .then(response => response.data);
        return request;
    }
);


export const getIntroText = createAsyncThunk(
    'intros/getIntroText', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/get-intro-text`) 
            .then(response => response.data);
        return request;
    }
);


export default introsSlice.reducer;