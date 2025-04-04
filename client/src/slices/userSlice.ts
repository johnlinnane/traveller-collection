import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

interface UserState {
  login?: any;
  logoutSuccess?: any;
  userItems?: any[];
  users?: any[];
  success?: boolean;
  details?: any;
}

const initialState: UserState = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.login = action.payload;
        })
        .addCase(logOutUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.logoutSuccess = action.payload;
            state.login.isAuth = false;
        })
        .addCase(getUserAuth.fulfilled, (state, action: PayloadAction<any>) => {
            state.login = action.payload;
        })
        .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
            state.details = action.payload;
        })
        .addCase(getUserItems.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.userItems = action.payload;
        })
        .addCase(getUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.users = action.payload;
        })
        .addCase(userRegister.fulfilled, (state, action: PayloadAction<{ success: boolean, users: User[] }>) => {
            state.success = action.payload.success;
            state.users = action.payload.users;
        })
        .addCase(userRegister.rejected, (state) => {
                state.success = false;
            });
    }
});


export const loginUser = createAsyncThunk(
    'user/loginUser', 
    async ({ email, password }: { email: string; password: string }) => {
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

export const getUserAuth = createAsyncThunk(
    'user/getUserAuth', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/get-user-auth`, {withCredentials: true}) 
            .then(response => response.data);
        return request;
    }
);

export const getUserDetails = createAsyncThunk(
    'user/getUserDetails', 
    async (id: string) => {
        const request = await axios.post(`${API_PREFIX}/get-user-details`, {id: id}, {withCredentials: true}) 
            .then(response => response.data);
        return request;
    }
);


export const getUserItems = createAsyncThunk(
    'user/getUserItems', 
    async (token: string) => {
        const request = axios.post(`${API_PREFIX}/user-items`, { token: token})
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

interface RegisterResponse {
    success: boolean;
    user: User;
}

export const userRegister = createAsyncThunk(
    'user/userRegister', 
    async ({ user, userList }: { user: User, userList: User[] }) => {
        try {
            const { data } = await axios.post<RegisterResponse>(`${API_PREFIX}/register`, user);
            const users = data.success ? [...userList, data.user] : userList;
            return {
                success: data.success,
                users
            };
        } catch (error) {
            return {
                success: false,
                users: userList
            };
        }
    }
);


export default userSlice.reducer;