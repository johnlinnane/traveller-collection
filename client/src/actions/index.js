import axios from 'axios';
axios.defaults.withCredentials = true;

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

export function getUserItems(userId) {
    const request = axios.get(`${API_PREFIX}/user-items?user=${userId}`)
                        .then(response => response.data);
    
    return {
        type:'GET_USER_ITEMS',
        payload:request
    }
}

export function clearItem() {
    return {
        type:'CLEAR_ITEM',
        payload: {
            item: null,
            updateItem:false,
            itemDeleted:false
        }
    }
}

export function acceptItem(itemId, userId) {

    const request = axios.get(`${API_PREFIX}/accept-item?itemid=${itemId}&userid=${userId}`)
                        .then(response => response.data);
    return {
        type: 'ACCEPT_ITEM',
        payload:request
    }
}

export function loginUser({email, password}) {
    const request = axios.post(`${API_PREFIX}/login`, {email, password}, {withCredentials: true})
                        .then(response => response.data);
    return {
        type:'USER_LOGIN',
        payload:request
    }
}

export function authGetCredentials() {
    const request = axios.get(`${API_PREFIX}/auth-get-user-creds`, {withCredentials: true}) 
                        .then(response => response.data)
    return {
        type:'USER_AUTH',
        payload:request
    }
}

export function getUsers() {
    const request = axios.get(`${API_PREFIX}/users`)
                        .then(response => response.data);
    return {
        type:'GET_USER',
        payload:request
    }
}

// uses thunk
export function userRegister(user, userList) {
    const request = axios.post(`${API_PREFIX}/register`, user);
    return (dispatch) => {
        request.then(({data}) => {

            // if register is wrong, don't send new user
            let users = data.success ? [...userList, data.user] : userList;
            let response = {
                success:data.success,
                users
            }
            dispatch({
                type:'USER_REGISTER',
                payload:response
            })
        })
    }
}




// ******************** ITEM ********************


export function getAllItems() {
    const request = axios.get(`${API_PREFIX}/all-items`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_ALL_ITEMS',
        payload:request
    }
}

export function getAllPendItems() {
    const request = axios.get(`${API_PREFIX}/all-pend-items`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_ALL_PEND_ITEMS',
        payload:request
    }
}

export function getItems(
    limit = 10,
    start = 0,
    order = 'asc',
    list = ''
) {
    const request = axios.get(`${API_PREFIX}/items?limit=${limit}&skip=${start}&order=${order}`)
                        .then(response => {
                            if(list){
                                return [...list, ...response.data]
                            } else {
                                return response.data
                            }
                        })
    return {
        type:'GET_ITEMS',
        payload:request
    }
}

export function getItemOrPending(id) {
    // reduxthunk's dispatched function sends payload to reducers whenever we are ready
    return (dispatch) => {
        axios.get(`${API_PREFIX}/get-item-by-id?id=${id}`)
            .then(res => {
                if (res.data.length !== 0) {
                    let response = {
                        item:res.data, 
                    }
                    dispatch({
                        type:'GET_ITEM_OR_PENDING',
                        payload:response
                    });
                } else {
                    axios.get(`${API_PREFIX}/get-pend-item-by-id?id=${id}`)
                        .then(({data}) => {
                            if (data.length !== 0) {
                                let response = {
                                    item:data, 
                                    pendingItemFound: true
                                }
                                dispatch({
                                    type:'GET_ITEM_OR_PENDING',
                                    payload:response
                                });
                            } else {
                                let response = {
                                    noPendingItemFound: true
                                }
                                dispatch({
                                    type:'GET_ITEM_OR_PENDING',
                                    payload:response
                                });
                            }
                        })
                }
            })
            .catch(err => {
                dispatch({
                    type:'GET_ITEM_OR_PENDING',
                    payload:{error: true}
                });
            })
    }
}

export function clearItemWithContributor() {
    return {
        type:'CLEAR_ITEM_W_CONTRIBUTOR',
        payload:{
            items: null,
            cats: null,
            subcats: null,
            nextitem: null,
            previtem: null,
            parentpdf: null
        }
    }
}

export function addItem(item) {
    const request = axios.post(`${API_PREFIX}/create-item`, item)
                        .then(response => response.data);
    return {
        type: 'CREATE_ITEM',
        payload:request
    }
}

export function addPendingItem(item) {
    const request = axios.post(`${API_PREFIX}/create-item-pending`, item)
                        .then(response => response.data);
    return {
        type: 'CREATE_PEND_ITEM',
        payload:request
    }
}


export function clearNewItem() {
    return {
        type:'CLEAR_NEWITEM',
        payload:null
    }
}

export function getNextItem(oldId) {
    const request = axios.get(`${API_PREFIX}/get-next-item?oldId=${oldId}`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_NEXT_ITEM',
        payload:request
    }
}

export function getPrevItem(oldId) {
    const request = axios.get(`${API_PREFIX}/get-prev-item?oldId=${oldId}`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_PREV_ITEM',
        payload:request
    }
}

export function getSubcat(subcatId) {
    const request = axios.get(`${API_PREFIX}/get-subcat-by-id?subcatid=${subcatId}`)
        .then(response => {
                return response.data
            }    
        );
    return {
        type: 'GET_SUBCAT',
        payload: request
    }
}

export function getItemsBySubcat(subcatId) {
    const request = axios.get(`${API_PREFIX}/get-items-by-subcat?subcatid=${subcatId}`)
        .then(response => {
                return response.data
            }    
        );
    return {
        type: 'GET_ITEMS_BY_SUBCAT',
        payload: request
    }
}

export function getItemsWithCoords() {
    const request = axios.get(`${API_PREFIX}/get-items-with-coords`)
        .then(response => {
                return response.data
            }    
        );
    return {
        type: 'GET_ITEMS_W_COORDS',
        payload: request
    }
}



// * * * * * * * * * *  EDIT ITEMS * * * * * * * * * *  

export function getItemById(id) {
    const request = axios.get(`${API_PREFIX}/get-item-by-id?id=${id}`)
                        .then(response => response.data);
    return {
        type:'GET_ITEM',
        payload:request
    }
}

export function getParentPdf(id) {
    const request = axios.get(`${API_PREFIX}/get-parent-pdf?id=${id}`)
                        .then(response => response.data);
    return {
        type:'GET_PARENT_PDF',
        payload:request
    }
}

export function getPendItemById(id) {
    const request = axios.get(`${API_PREFIX}/get-pend-item-by-id?id=${id}`)
                        .then(response => response.data);
    return {
        type:'GET_PEND_ITEM',
        payload:request
    }
}

export function updateItem(data) {
    const request = axios.post(`${API_PREFIX}/item-update`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_ITEM',
        payload:request
    }
}

export function deleteChapter(parentId, title) {
    const request = axios.get(`${API_PREFIX}/get-item-by-id?id=${parentId}`)
    return (dispatch) => {
        request.then(({data}) => {
            data.pdf_page_index.forEach( (chapt, i) => {
                if (chapt.heading === title && chapt.has_child === true) {
                    data.pdf_page_index[i].has_child = false;
                    data.pdf_page_index[i].child_id = null
                }
            })
            const request = axios.post(`${API_PREFIX}/item-update`, data)
                            .then(response => response.data);
                            return {
                                type:'DELETE_CHAPT',
                                payload:request
                            }
        })
    }
}

export function updatePendItem(data) {
    const request = axios.post(`${API_PREFIX}/item-pend-update`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_PEND_ITEM',
        payload:request
    }
}

export function deleteItem(id) {
    const request = axios.delete(`${API_PREFIX}/delete-item?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_ITEM',
        payload:request
    }
}

export function deletePendItem(id) {
    const request = axios.delete(`${API_PREFIX}/del-pend-item?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DEL_PEND_ITEM',
        payload:request
    }
}

export function getFilesFolder(data) {
    const request = axios.post(`${API_PREFIX}/get-files-folder`, data)
                        .then(response => response.data);
    return {
        type:'GET_FILES_FOLDER',
        payload:request
    }
}



// ******************** CATEGORIES ********************


export function getAllCats() {
    const request = axios.get(`${API_PREFIX}/get-all-categories`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_ALL_CATS',
        payload:request
    }
}

export function getCatById(catId) {
    const request = axios.get(`${API_PREFIX}/get-cat-by-id?id=${catId}`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_CAT_BY_ID',
        payload:request
    }
}



export function getItemsByCat(catId) {
    const request = axios.get(`${API_PREFIX}/get-items-by-cat?value=${catId}`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_ITEMS_BY_CAT',
        payload:request
    }
}

export function getItemsWithCat(catId) {
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
                    dispatch({
                        type:'GET_ITEMS_W_CAT',
                        payload:response
                    })
                })
        })
    }
}

export function addCat(cat) {
    const request = axios.post(`${API_PREFIX}/add-cat`, cat)
                        .then(response => response.data);
    return {
        type: 'ADD_CAT',
        payload:request
    }
}

export function deleteCat(id) {
    const request = axios.delete(`${API_PREFIX}/delete-cat?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_CAT',
        payload:request
    }
}

export function updateCat(data) {
    const request = axios.post(`${API_PREFIX}/cat-update`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_CAT',
        payload:request
    }
}


// ******************** SUB-CATEGORIES ********************


export function getAllSubCats() {
    const request = axios.get(`${API_PREFIX}/get-all-subcategories`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_ALL_SUBCATS',
        payload:request
    }
}

export function addSubcat(subCat) {
    const request = axios.post(`${API_PREFIX}/add-subcat`, subCat)
                        .then(response => response.data);
    return {
        type: 'ADD_SUBCAT',
        payload:request
    }
}

export function deleteSubcat(id) {
    const request = axios.delete(`${API_PREFIX}/delete-subcat?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_SUBCAT',
        payload:request
    }
}

export function updateSubcat(data) {
    const request = axios.post(`${API_PREFIX}/subcat-update`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_SUBCAT',
        payload:request
    }
}


// ******************** INTRO ********************



export function updateIntroText(data) {
    const request = axios.post(`${API_PREFIX}/update-intro-text`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_INTRO_TEXT',
        payload:request
    }
}

export function getIntroText() {
    const request = axios.get(`${API_PREFIX}/get-intro-text`)
        .then(response => {
                return response.data
            }    
        );
    return {
        type: 'GET_INTRO_TEXT',
        payload: request
    }
}


// ******************** INFO ********************

export function updateInfoText(data) {
    const request = axios.post(`${API_PREFIX}/update-info-text`, data)
                        .then(response => response.data);
    return {
        type:'UPDATE_INFO_TEXT',
        payload:request
    }
}

export function getInfoText() {
    const request = axios.get(`${API_PREFIX}/get-info-text`)
        .then(response => {
                return response.data
            }    
        );
    return {
        type: 'GET_INFO_TEXT',
        payload: request
    }
}