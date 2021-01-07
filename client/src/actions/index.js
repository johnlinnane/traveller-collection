import axios from 'axios';



// get every post of particular user
export function getUserPosts(userId) {
    const request = axios.get(`/api/user_posts?user=${userId}`)
                        .then(response => response.data);
    return {
        type:'GET_USER_POSTS',
        payload:request
    }
}



// * * * * * * * * * *  GET ITEMS  BY USER* * * * * * * * * *  

export function getUserItems(userId) {
    const request = axios.get(`/api/user_items?user=${userId}`)
                        .then(response => response.data);
    
    return {
        type:'GET_USER_ITEMS',
        payload:request
    }
}




// * * * * * * * * * CLEAR ITEM * * * * * * 

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



///////// * * * * * * * * * ACCEPT PENDING ITEM * * * * * * 

// export function acceptItem() {
//     console.log('HIT')
//     const request = axios.post(`/api/accept-item`)
//                         .then(response => response.data);

//     return {
//         type:'ACCEPT_ITEM',
//         payload:request

//     }
// }

export function acceptItem(itemId, userId) {

    console.log('user ID: ' + userId);

    const request = axios.get(`/api/accept-item?itemid=${itemId}&userid=${userId}`)
                        .then(response => response.data);
    

    return {
        type: 'ACCEPT_ITEM',
        payload:request
    }
}

// ******************** USER ACTIONS ********************

export function loginUser({email, password}) {

    const request = axios.post('/api/login', {email, password})
                        .then(response => response.data);

    return {
        type:'USER_LOGIN',
        payload:request
    }
}


export function auth() {
    const request = axios.get('/api/auth') 
                        .then(response => response.data);

    return {
        type:'USER_AUTH',
        payload:request
    }

}



export function getUsers() {
    const request = axios.get(`/api/users`)
                        .then(response => response.data);

    return {
        type:'GET_USER',
        payload:request
    }

}

// uses thunk
export function userRegister(user, userList) {
    const request = axios.post(`/api/register`, user);

    return (dispatch) => {
        request.then(({data}) => {

            // if register is wrong, don't send new user
            let users = data.success ? [...userList, data.user] : userList;

            let response = {
                success:data.success,
                users    // result of conditional
            }

            dispatch({
                type:'USER_REGISTER',
                payload:response
            })
        })
    }
}




// ******************** ITEM ACTIONS ********************


export function getAllItems() {
    const request = axios.get(`/api/allItems`)
                        .then(response => {
                                return response.data
                            }
                        );

    // console.log(request);

    return {
        type:'GET_ALL_ITEMS',
        payload:request
    }
}


//////////////////
export function getAllPendItems() {
    const request = axios.get(`/api/allPendItems`)
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
    const request = axios.get(`/api/items?limit=${limit}&skip=${start}&order=${order}`)
                        .then(response => {
                            if(list){
                                return [...list, ...response.data]
                            } else {
                                return response.data
                            }
                        })

    // console.log(request);

    return{
        type:'GET_ITEMS',
        payload:request
    }
}




// two requests inside one action, item and user. user reduxthunk
export function getItemWithContributor(id) {

    // reduxthunk's dispatched function sends payload to reducers whenever we are ready
    // as an alternative to getItems
    const request = axios.get(`/api/getItemById?id=${id}`)

    // return a dispatch function
    return (dispatch) => {

        // get the promise, using {{{destructuring}}}
        request.then(({data}) => {
            let item = data;
            // console.log(item);

            // axios.get(`/api/getContributor?id=${item.ownerId}`)
            // console.log(data);

            // axios.get(`/api/getContributor?id=${item._id}`)
            axios.get(`/api/getContributor?id=5e99a141fb671004505351b4`)

                .then(({data}) => {
                
                    let response = {
                        item, 
                        contributor:data
                    }

                    // console.log(response);

                    // only gets executed when ready
                    dispatch({
                        type:'GET_ITEM_W_CONTRIBUTOR',
                        payload:response
                    })
                })
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

// item arg is json data
export function addItem(item) {

    console.log(item);

    const request = axios.post('/api/item', item)
                        .then(response => response.data);
    

    return {
        type: 'ADD_ITEM',
        payload:request
    }
}



export function addPendingItem(item) {
    console.log('action triggered');
    console.log(item);
    const request = axios.post('/api/item-pending', item)
                        .then(response => response.data);
    

    return {
        type: 'ADD_PEND_ITEM',
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
    const request = axios.get(`/api/getNextItem?oldId=${oldId}`)
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
    const request = axios.get(`/api/getPrevItem?oldId=${oldId}`)
                        .then(response => {
                                return response.data
                            }
                        );
    return {
        type:'GET_PREV_ITEM',
        payload:request
    }
}


export function getLatestItem() {
    const request = axios.get(`/api/getLatestItem`)
        .then(response => {
                return response.data
            }    
        );
    console.log(request);
    return {
        type: 'GET_LATEST_ITEM',
        payload: request
    }
}


export function getSubcat(subcatId) {
    const request = axios.get(`/api/getSubcat?subcatid=${subcatId}`)
        .then(response => {
                return response.data
            }    
        );
    console.log(request);
    return {
        type: 'GET_SUBCAT',
        payload: request
    }
}


export function getItemsBySubcat(subcatId) {
    const request = axios.get(`/api/getItemsBySubcat?subcatid=${subcatId}`)
        .then(response => {
                return response.data
            }    
        );
    // console.log(request);
    return {
        type: 'GET_ITEMS_BY_SUBCAT',
        payload: request
    }
}


// not used
export function getFirstItemBySubcat(catId, subcatId) {
    const request = axios.get(`/api/getFirstItemBySubcat?catid=${catId}&subcatid=${subcatId}`)
        .then(response => {
                return response.data
            }    
        );
    console.log(request);
    return {
        type: 'GET_FIRST_ITEM_SUBCAT',
        payload: request
    }
}



export function getItemsWithCoords() {
    const request = axios.get(`/api/getItemsWithCoords`)
        .then(response => {
                return response.data
            }    
        );
    console.log(request);
    return {
        type: 'GET_ITEMS_W_COORDS',
        payload: request
    }
}




// * * * * * * * * * *  EDIT ITEMS * * * * * * * * * *  

export function getItemById(id) {
    const request = axios.get(`/api/getItemById?id=${id}`)
                        .then(response => response.data);

    return {
        type:'GET_ITEM',
        payload:request
    }
}


export function getParentPdf(id) {
    const request = axios.get(`/api/getParentPdf?id=${id}`)
                        .then(response => response.data);

    return {
        type:'GET_PARENT_PDF',
        payload:request
    }
}


////////////////////////
export function getPendItemById(id) {
    const request = axios.get(`/api/getPendItemById?id=${id}`)
                        .then(response => response.data);

    return {
        type:'GET_PEND_ITEM',
        payload:request
    }
}


export function updateItem(data) {
    console.log('updateItem called');
    const request = axios.post(`/api/item_update`, data)
                        .then(response => response.data);
    console.log(data);
    return {
        type:'UPDATE_ITEM',
        payload:request
    }
}



export function deleteChapter(parentId, title) {
    const request = axios.get(`/api/getItemById?id=${parentId}`)

    return (dispatch) => {
        request.then(({data}) => {

            data.pdf_page_index.map( (chapt, i) => {

                if (chapt.heading === title && chapt.has_child === true) {
                    data.pdf_page_index[i].has_child = false;
                    data.pdf_page_index[i].child_id = null
                }
            })

            console.log(data)
            const request = axios.post(`/api/item_update`, data)
                            .then(response => response.data);

                            return {
                                type:'DELETE_CHAPT',
                                payload:request
                            }

        })
    }

}





/////////////////////
export function updatePendItem(data) {
    console.log('updatePendItem called');
    const request = axios.post(`/api/item_pend_update`, data)
                        .then(response => response.data);
    console.log(data);
    return {
        type:'UPDATE_PEND_ITEM',
        payload:request
    }
}

export function deleteItem(id) {
    const request = axios.delete(`/api/delete_item?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_ITEM',
        payload:request
    }
}

////////////////////
export function deletePendItem(id) {
    const request = axios.delete(`/api/del_pend_item?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DEL_PEND_ITEM',
        payload:request
    }
}


export function getFilesFolder(data) {
    console.log('getFilesFolder called');
    const request = axios.post(`/api/get-files-folder`, data)
                        .then(response => response.data);
    return {
        type:'GET_FILES_FOLDER',
        payload:request
    }
}



// ******************** CATEGORIES ACTIONS ********************


export function getAllCats() {
    const request = axios.get(`/api/categories`)
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
    const request = axios.get(`/api/getCatById?id=${catId}`)
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
    const request = axios.get(`/api/getItemsByCat?value=${catId}`)
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
    const request = axios.get(`/api/getCatById?id=${catId}`)

    return (dispatch) => {
        request.then(({data}) => {
            let catInfo = data;
            // console.log(item);

            console.log(data);

            axios.get(`/api/getItemsByCat?value=${catInfo._id}`)

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
    const request = axios.post('/api/add-cat', cat)
                        .then(response => response.data);
    

    return {
        type: 'ADD_CAT',
        payload:request
    }
}



export function deleteCat(id) {
    console.log('delete cat called');
    const request = axios.delete(`/api/delete-cat?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_CAT',
        payload:request
    }
}

export function updateCat(data) {
    console.log('updateCat called');
    const request = axios.post(`/api/cat-update`, data)
                        .then(response => response.data);
    // console.log(data);
    return {
        type:'UPDATE_CAT',
        payload:request
    }
}


// ******************** SUB-CATEGORIES ACTIONS ********************


export function getAllSubCats() {
    const request = axios.get(`/api/subcategories`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_ALL_SUBCATS',
        payload:request
    }
}



export function getSubcatById(SubcatId) {
    const request = axios.get(`/api/getSubcatById?id=${SubcatId}`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_SUBCAT_BY_ID',
        payload:request
    }
}


export function getSubcatByCat(catId) {
    const request = axios.get(`/api/getSubcatByCat?catid=${catId}`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_SUBCAT_BY_CAT',
        payload:request
    }
}


export function addSubcat(subCat) {
    const request = axios.post('/api/add-subcat', subCat)
                        .then(response => response.data);
    return {
        type: 'ADD_SUBCAT',
        payload:request
    }
}


export function deleteSubcat(id) {
    const request = axios.delete(`/api/delete-subcat?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_SUBCAT',
        payload:request
    }
}

export function updateSubcat(data) {
    console.log('updateSubcat called');
    const request = axios.post(`/api/subcat-update`, data)
                        .then(response => response.data);
    // console.log(data);
    return {
        type:'UPDATE_SUBCAT',
        payload:request
    }
}


// ******************** INTRO ACTIONS ********************



export function updateIntroText(data) {
    console.log('updateIntroText called');
    const request = axios.post(`/api/update-intro-text`, data)
                        .then(response => response.data);
    // console.log(data);
    return {
        type:'UPDATE_INTRO_TEXT',
        payload:request
    }
}


export function getIntroText() {
    console.log('getIntroText called')
    const request = axios.get(`/api/getIntroText`)
        .then(response => {
                return response.data
            }    
        );
    console.log(request);
    return {
        type: 'GET_INTRO_TEXT',
        payload: request
    }
}



// ******************** INFO ACTIONS ********************



export function updateInfoText(data) {
    console.log('updateInfoText called');
    const request = axios.post(`/api/update-info-text`, data)
                        .then(response => response.data);
    // console.log(data);
    return {
        type:'UPDATE_INFO_TEXT',
        payload:request
    }
}


export function getInfoText() {
    // console.log('getInfoText called')
    const request = axios.get(`/api/getInfoText`)
        .then(response => {
                return response.data
            }    
        );
    // console.log(request);
    return {
        type: 'GET_INFO_TEXT',
        payload: request
    }
}