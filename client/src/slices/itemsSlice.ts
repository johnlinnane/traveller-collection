import axios from 'axios';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Item } from '../types';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

interface ItemsState {
    list?: Item[];
    item?: Item;
    parentpdf?: string;
    items?: Item[];
    results?: Item[];
    chaptDeleted?: boolean;
    contributor?: string;
    newitem?: Item;
    updateItemSuccess?: boolean;
    postDeleted?: boolean;
    nextitem?: Item;
    previtem?: Item;
    files?: string[];
    updateItem?: boolean;
}

const initialState: ItemsState = {};




const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getItemById.fulfilled, (state, action: PayloadAction<Item>) => {
                state.item = action.payload;
            })
            .addCase(getParentPdf.fulfilled, (state, action: PayloadAction<string>) => {
                state.parentpdf = action.payload;
            })
            .addCase(getAllItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
                state.items = action.payload;
            })
            .addCase(searchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
                state.results = action.payload;
            })
            .addCase(getAllPendItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
                state.items = action.payload;
            })
            .addCase(deleteChapter.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.chaptDeleted = action.payload;
            })
            .addCase(clearItemFromState.fulfilled, (state, action: PayloadAction<any>) => {
                state.items = action.payload.items;
                state.nextitem = action.payload.nextitem;
                state.previtem = action.payload.previtem;

            })
            .addCase(createItem.fulfilled, (state, action: PayloadAction<Item>) => {
                state.newitem = action.payload;
            })
            .addCase(clearNewItem.fulfilled, (state, action: PayloadAction<null>) => {
                state.newitem = action.payload;
            })
            .addCase(updateItem.fulfilled, (state, action: PayloadAction<{ success: boolean; doc: Item }>) => {
                state.updateItemSuccess = action.payload.success;
                state.item = action.payload.doc;
            })
            // .addCase(updatePendItem.fulfilled, (state, action: PayloadAction<{ success: boolean; doc: Item }>) => {
            //     state.updateItemSuccess = action.payload.success;
            //     state.item = action.payload.doc;
            // })
            .addCase(deleteItem.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.postDeleted = action.payload;
            })
            .addCase(deletePendItem.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.postDeleted = action.payload;
            })
            .addCase(getNextItem.fulfilled, (state, action: PayloadAction<Item>) => {
                state.nextitem = action.payload;
            })
            .addCase(getPrevItem.fulfilled, (state, action: PayloadAction<Item>) => {
                state.previtem = action.payload;
            })
            .addCase(getItemsWithCoords.fulfilled, (state, action: PayloadAction<Item[]>) => {
                state.items = action.payload;
            })
            .addCase(acceptItem.fulfilled, (state, action: PayloadAction<null>) => {
                // Uncomment and update if additional handling is needed
                // state = action.payload;
            })
            .addCase(getFilesFolder.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.files = action.payload;
            });
    },
});

export const getItemById = createAsyncThunk(
    'items/getItemById', 
    async (id: string) => {
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
    async ({keyword, resultsNumber}: {keyword: string, resultsNumber: number}) => {
        const request = axios.get(`${API_PREFIX}/search-items?input=${keyword}&resultsNumber=${resultsNumber}`)
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

export const deleteChapter = createAsyncThunk<boolean, { parentId: string; title: string }>(
    'items/deleteChapter',
    async ({ parentId, title }) => {
        try {
            const { data } = await axios.get(`${API_PREFIX}/get-item-by-id?id=${parentId}`);

            data.pdf_page_index.forEach((chapt: any, i: number) => {
                if (chapt.heading === title && chapt.has_child === true) {
                    data.pdf_page_index[i].has_child = false;
                    data.pdf_page_index[i].child_id = null;
                }
            });
            await axios.post(`${API_PREFIX}/item-update`, data);
            return true;
        } catch (error) {
            console.error('Error deleting chapter:', error);
            return false;
        }
    }
);


export const clearItemFromState = createAsyncThunk(
    'items/clearItemFromState', 
    async () => {
        return {
            items: null,
            nextitem: null,
            previtem: null,
            parentpdf: null
        };
    }
);

export const createItem = createAsyncThunk(
    'items/createItem', 
    async (item: Item) => {
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
    async (item: Partial<Item>) => {
        const request = await axios.post(`${API_PREFIX}/item-update`, item) 
            .then(response => response.data);
        return request;
    }
);

// export const updatePendItem = createAsyncThunk(
//     'items/updatePendItem', 
//     async (data) => {
//         const request = await axios.post(`${API_PREFIX}/item-pend-update`, data) // not in server.ts
//             .then(response => response.data);
//         return request;
//     }
// );

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
    async (id: string) => {
        const request = await axios.delete(`${API_PREFIX}/del-pend-item?id=${id}`) 
            .then(response => response.data);
        return request;
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