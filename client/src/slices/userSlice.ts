import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // PayloadAction
import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

// interface UserState {
//     isAuth: boolean,
//     id: string,
//     email: string,
//     name: string,
//     lastname: string,
    
//     login: boolean,
//     userItems: any,
//     users: any
//     register: boolean,

//     success: any
// }

// const initialState: UserState = {
//     isAuth:true,
//     id: '',
//     email: '',
//     name: '',
//     lastname: '',
    
//     login: false,
//     userItems: null,
//     users: null,
//     register: false,

//     success: false
// }

interface UserState {}
const initialState: UserState = {}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder 
            .addCase(loginUser.fulfilled, (state, action) => { // PayloadAction<UserState>
                state.login = action.payload;
            })
            .addCase(logOutUser.fulfilled, (state, action) => { // PayloadAction<UserState>
                state.logoutSuccess = action.payload;
            })
            .addCase(authGetCredentials.fulfilled, (state, action) => {
                state.login = action.payload;
            })
            .addCase(getUserItems.fulfilled, (state, action) => {
                state.userItems = action.payload;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.register = action.payload.success;
                state.users = action.payload.users;
            }) // was giving errors
    }
})


export const loginUser = createAsyncThunk(
    'user/loginUser', 
    async (email, password) => {
        const request = axios.post(`${API_PREFIX}/login`, {email, password}, {withCredentials: true})
            .then(response => response.data);
        return request;
    }
);

export const logOutUser = createAsyncThunk(
    'user/logOutUser', 
    async () => {
        const request = axios.get(`${API_PREFIX}/logout`, {withCredentials: true})
            .then(response => response.data);
        return request;
    }
);

export const authGetCredentials = createAsyncThunk(
    'user/authGetCredentials', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/auth-get-user-creds`, {withCredentials: true}) 
            .then(response => response.data);
        return request;
    }
);


export const getUserItems = createAsyncThunk(
    'user/getUserItems', 
    async (userId: string | number) => {
        const request = axios.get(`${API_PREFIX}/user-items?user=${userId}`)
            .then(response => response.data);
        return request;
    }
);

export const getUsers = createAsyncThunk(
    'user/getUsers', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/users`) 
            .then(response => response.data);
        return request;
    }
);

export const userRegister = createAsyncThunk(
    'user/userRegister', 
    async (user, userList) => {
        const request = axios.post(`${API_PREFIX}/register`, user);
        // return (dispatch: Dispatch<any>) => {
        return () => {
            request.then(({data}) => {

                let users = data.success ? [...userList, data.user] : userList;
                let response = {
                    success:data.success,
                    users
                }
                return response;
            })
        }
    }
);


export default userSlice.reducer;