import axios from 'axios';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const API_PREFIX = process.env.REACT_APP_API_PREFIX;

interface ItemsState {};

const initialState: ItemsState = {};

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getItems.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.list = action.payload;
            })
            .addCase(getItemById.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.item = action.payload;
            })
            .addCase(getParentPdf.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.parentpdf = action.payload;
            })
            .addCase(getAllItems.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.items = action.payload;
            })
            .addCase(searchItems.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.results = action.payload;
            })
            .addCase(getAllPendItems.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.items = action.payload;
            })
            .addCase(deleteChapter.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.chaptDeleted = action.payload;
            })
            .addCase(clearItemWithContributor.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.item = action.payload.item;
                state.contributor = action.payload.contributor;
            })
            .addCase(createItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.newitem = action.payload;
            })
            .addCase(clearNewItem.fulfilled, (state, action: PayloadAction<any>) => {
                state.newitem = action.payload;
            })
            .addCase(updateItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.updateItemSuccess = action.payload.success;
                state.item = action.payload.doc;
            })
            .addCase(updatePendItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.updateItemSuccess = action.payload.success;
                state.item = action.payload.doc;
            })
            .addCase(deleteItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.postDeleted = action.payload;
            })
            .addCase(deletePendItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.postDeleted = action.payload;
            })
            .addCase(clearItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.updateItem = action.payload.updateItem;
                state.item = action.payload.item;
                state.postDeleted = action.payload.postDeleted;
            })
            .addCase(getNextItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.nextitem = action.payload;
            })
            .addCase(getPrevItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.previtem = action.payload;
            })
            .addCase(getItemsWithCoords.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.items = action.payload;
            })
            .addCase(acceptItem.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                // state = action.payload;
            })
            .addCase(getFilesFolder.fulfilled, (state, action: PayloadAction<ItemsState>) => {
                state.files = action.payload;
            })
    }
})


export const getItems = createAsyncThunk(
    'items/getItems', 
    async (
        limit: number = 10,
        start = 0,
        order = 'asc',
        list = ''
    ) => {
        const request = axios.get(`${API_PREFIX}/items?limit=${limit}&skip=${start}&order=${order}`)
            .then(response => {
                if(list){
                    return [...list, ...response.data]
                } else {
                    return response.data
                }
            })
        return request;
    }
);


export const getItemById = createAsyncThunk(
    'items/getItemById', 
    async (id) => {
        const request = axios.get(`${API_PREFIX}/get-item-by-id?id=${id}`)
            .then(response => response.data);
        return request;
    }
);

export const getParentPdf = createAsyncThunk(
    'items/getParentPdf', 
    async (id: string) => {
        const request = axios.get(`${API_PREFIX}/get-parent-pdf?id=${id}`)
            .then(response => response.data);
        return request;
    }
);

export const getAllItems = createAsyncThunk(
    'items/getAllItems', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/all-items`) 
            .then(response => response.data);
        return request;
    }
);

export const searchItems = createAsyncThunk(
    'items/searchItems', 
    async (input, resultsNumber) => {
        const request = axios.get(`${API_PREFIX}/search-items?input=${input}&resultsNumber=${resultsNumber}`)
            .then(response => response.data);
        return request;
    }
);

export const getAllPendItems = createAsyncThunk(
    'items/getAllPendItems', 
    async () => {
        const request = axios.get(`${API_PREFIX}/all-pend-items`)
            .then(response => {
                return response.data
            })
            .catch(err => {
                return { error: true, msg: err }
            })
        return request;
    }
);

export const deleteChapter = createAsyncThunk(
    'items/deleteChapter', 
    async (parentId, title) => {
        const request = axios.get(`${API_PREFIX}/get-item-by-id?id=${parentId}`)
        return (dispatch) => {
            request.then(({data}) => {
                data.pdf_page_index.forEach( (chapt, i: number) => {
                    if (chapt.heading === title && chapt.has_child === true) {
                        data.pdf_page_index[i].has_child = false;
                        data.pdf_page_index[i].child_id = null
                    }
                })
                const request = axios.post(`${API_PREFIX}/item-update`, data)
                    .then(response => response.data);
                return request;
            })
        }
    }
);

export const clearItemWithContributor = createAsyncThunk(
    'items/clearItemWithContributor', 
    async () => {
        return {
            items: null,
            cats: null,
            subcats: null,
            nextitem: null,
            previtem: null,
            parentpdf: null
        };
    }
);

export const createItem = createAsyncThunk(
    'items/createItem', 
    async (item) => {
        const request = await axios.post(`${API_PREFIX}/create-item`, item) 
            .then(response => response.data);
        return request;
    }
);



export const clearNewItem = createAsyncThunk(
    'items/clearNewItem', 
    async () => {
        return null;
    }
);

export const updateItem = createAsyncThunk(
    'items/updateItem', 
    async (data) => {
        const request = await axios.post(`${API_PREFIX}/item-update`, data) 
            .then(response => response.data);
        return request;
    }
);

export const updatePendItem = createAsyncThunk(
    'items/updatePendItem', 
    async (data) => {
        const request = await axios.get(`${API_PREFIX}/item-pend-update`, data) // not in server.ts
            .then(response => response.data);
        return request;
    }
);

export const deleteItem = createAsyncThunk(
    'items/deleteItem', 
    async (id: string) => {
        const request = axios.delete(`${API_PREFIX}/delete-item?id=${id}`)
            .then(response => response.data)
        return request;
    }
);

export const deletePendItem = createAsyncThunk(
    'items/deletePendItem', 
    async (id) => {
        const request = await axios.delete(`${API_PREFIX}/del-pend-item?id=${id}`) 
            .then(response => response.data);
        return request;
    }
);

export const clearItem = createAsyncThunk(
    'items/clearItem', 
    async () => {
        return {
            item: null,
            updateItem:false,
            itemDeleted:false
        }
    }
);


export const getNextItem = createAsyncThunk(
    'items/getNextItem', 
    async (currentId: string) => {
        const request = axios.get(`${API_PREFIX}/get-next-item?currentId=${currentId}`)
            .then(response => {
                    return response.data
                }
            );
        return request;
    }
);

export const getPrevItem = createAsyncThunk(
    'items/getPrevItem', 
    async (currentId: string) => {
        const request = axios.get(`${API_PREFIX}/get-prev-item?currentId=${currentId}`)
            .then(response => {
                    return response.data
                }
            );
        return request;
    }
);

export const getItemsWithCoords = createAsyncThunk(
    'items/getItemsWithCoords', 
    async () => {
        const request = await axios.get(`${API_PREFIX}/get-items-with-coords`) 
            .then(response => response.data);
        return request;
    }
);

export const acceptItem = createAsyncThunk(
    'items/acceptItem', 
    async (itemId: string | number) => {
        const request = axios.get(`${API_PREFIX}/accept-item?itemid=${itemId}`)
            .then(response => response.data);
        return request;
    }
);

export const getFilesFolder = createAsyncThunk(
    'items/getFilesFolder', 
    async (data: {folder: string}) => {
        const request = await axios.post(`${API_PREFIX}/get-files-folder`, data) 
            .then(response => response.data);
        return request;
    }
);

export default itemsSlice.reducer;