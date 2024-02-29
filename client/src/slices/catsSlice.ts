import axios from 'axios';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;


interface CatsState {};

const initialState: CatsState = {};


const catsSlice = createSlice({
    name: "cats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCats.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.cats = action.payload;
            })
            .addCase(getItemsByCat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.catitems = action.payload;
            })
            .addCase(getCatById.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.catinfo = action.payload;
            })
            .addCase(getItemsWithCat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.catitems = action.payload;
            })
            .addCase(getAllSubCats.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.subcats = action.payload;
            })
            .addCase(getItemsBySubcat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.subcatitems = action.payload;
            })
            .addCase(getSubcat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.subcat = action.payload;
            })
            .addCase(addCat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.newcat = action.payload;
            })
            .addCase(deleteCat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.catDeleted = action.payload;
            })
            .addCase(addSubcat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.newsubcat = action.payload;
            })
            .addCase(deleteSubcat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.subcatDeleted = action.payload;
            })
            .addCase(updateCat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.updateCat = action.payload.success;
                state.cat = action.payload.doc;
            })
            .addCase(updateSubcat.fulfilled, (state, action: PayloadAction<CatsState>) => {
                state.updateSubcat = action.payload.success;
                state.subcat = action.payload.doc;
            })
    }
})


export const getAllCats = createAsyncThunk(
    'cats/getAllCats', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/get-all-categories`) 
            .then(response => response.data);
        return request;
    }
);

export const getItemsByCat = createAsyncThunk(
    'cats/getItemsByCat', 
    async (catId) => {
        const request = await axios.get(`${API_PREFIX}/get-items-by-cat?value=${catId}`) 
            .then(response => response.data);
        return request;
    }
);

export const getCatById = createAsyncThunk(
    'cats/getCatById', 
    async (catId) => {
        const request = await axios.get(`${API_PREFIX}/get-cat-by-id?id=${catId}`) 
            .then(response => response.data);
        return request;
    }
);

export const getItemsWithCat = createAsyncThunk(
    'cats/getItemsWithCat', 
    async (catId) => {
        const request = axios.get(`${API_PREFIX}/get-cat-by-id?id=${catId}`)
        return (dispatch) => {
            request.then(({data}) => {
                let catInfo = data;
                axios.get(`${API_PREFIX}/get-items-by-cat?value=${catInfo._id}`)
                    .then(({data}) => {
                        let response = {
                            catInfo, 
                            catItems:data
                        }
                        return response;
                    })
            })
        }
        
    }
);

export const getAllSubCats = createAsyncThunk(
    'cats/getAllSubCats', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/get-all-subcategories`) 
            .then(response => response.data);
        return request;
    }
);

export const getItemsBySubcat = createAsyncThunk(
    'cats/getItemsBySubcat', 
    async (subcatId) => {
        const request = axios.get(`${API_PREFIX}/get-items-by-subcat?subcatid=${subcatId}`)
            .then(response => {
                    return response.data
                }    
            );
        return request;
    }
);

export const getSubcat = createAsyncThunk(
    'cats/getSubcat', 
    async (subcatId) => {
        const request = axios.get(`${API_PREFIX}/get-subcat-by-id?subcatid=${subcatId}`)
            .then(response => {
                    return response.data
                }    
            );
        return request;
    }
);

export const addCat = createAsyncThunk(
    'cats/addCat', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/add-cat`) 
            .then(response => response.data);
        return request;
    }
);

export const deleteCat = createAsyncThunk(
    'cats/deleteCat', 
    async (id) => {
        const request = axios.delete(`${API_PREFIX}/delete-cat?id=${id}`)
            .then(response => response.data)
        return request;
    }
);

export const addSubcat = createAsyncThunk(
    'cats/addSubcat', 
    async (subCat) => {
        const request = axios.post(`${API_PREFIX}/add-subcat`, subCat)
            .then(response => response.data);
        return request;
    }
);

export const deleteSubcat = createAsyncThunk(
    'cats/deleteSubcat', 
    async (id) => {
        const request = axios.delete(`${API_PREFIX}/delete-subcat?id=${id}`)
            .then(response => response.data)
        return request;
    }
);

export const updateCat = createAsyncThunk(
    'cats/updateCat', 
    async (data) => {
        const request = axios.post(`${API_PREFIX}/cat-update`, data)
            .then(response => response.data);
        return request;
    }
);

export const updateSubcat = createAsyncThunk(
    'cats/updateSubcat', 
    async (data) => {
        const request = axios.post(`${API_PREFIX}/subcat-update`, data)
            .then(response => response.data);
        return request;
    }
);

export default catsSlice.reducer;