import axios from 'axios';

// **********************
// *** DELETE ME ********

// export function getBooks(
//     limit = 10,
//     start = 0,
//     order = 'asc',
//     list = ''
// ) {
//     const request = axios.get(`/api/books?limit=${limit}&skip=${start}&order=${order}`)
//                         .then(response => {
//                             if(list){
//                                 return [...list, ...response.data]
//                             } else {
//                                 return response.data
//                             }
//                         })

//     // console.log(request);

//     return{
//         type:'GET_BOOKS',
//         payload:request
//     }
// }




// **********************
// *** DELETE ME ********

// // two requests inside one action, book and user. user reduxthunk
// export function getBookWithReviewer(id) {

//     // reduxthunk's dispatched function sends payload to reducers whenever we are ready
//     // as an alternative to getBooks
//     const request = axios.get(`/api/getBook?id=${id}`)

//     // return a dispatch function
//     return (dispatch) => {

//         // get the promise, using {{{destructuring}}}
//         request.then(({data}) => {
//             let book = data;
//             // console.log(book);

//             axios.get(`/api/getReviewer?id=${book.ownerId}`)
//                 .then(({data}) => {
                
//                     let response = {
//                         book, 
//                         reviewer:data
//                     }

//                     // console.log(response);

//                     // only gets executed when ready
//                     dispatch({
//                         type:'GET_BOOK_W_REVIEWER',
//                         payload:response
//                     })
//                 })
//         })
//     }
// }


// // **********************
// // *** DELETE ME ********
// export function clearBookWithReviewer() {
//     return {
//         type:'CLEAR_BOOK_W_REVIEWER',
//         payload:{
//             book:{},
//             reviewer:{}
//         }
//     }
// }


// // **********************
// // *** DELETE ME ********
// // book arg is json data
// export function addBook(book) {
//     const request = axios.post('/api/book', book)
//                         .then(response => response.data);

//     return {
//         type: 'ADD_BOOK',
//         payload:request
//     }
// }



// // **********************
// // *** DELETE ME ********
// export function clearNewBook() {
//     return {
//         type:'CLEAR_NEWBOOK',
//         payload:null
//     }
// }



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



// ******************** EDIT REVIEW ********************

// // **********************
// // *** DELETE ME ********
// export function getBook(id) {
//     const request = axios.get(`/api/getBook?id=${id}`)
//                         .then(response => response.data);

//     return {
//         type:'GET_BOOK',
//         payload:request
//     }
// }





// // **********************
// // *** DELETE ME ********
// export function updateBook(data) {
//     const request = axios.post(`/api/book_update`, data)
//                         .then(response => response.data);
//     return {
//         type:'UPDATE_BOOK',
//         payload:request
//     }
// }
// export function deleteBook(id) {
//     const request = axios.delete(`/api/delete_book?id=${id}`)
//                         .then(response => response.data)
//     return {
//         type:'DELETE_BOOK',
//         payload:request
//     }
// }
// export function clearBook() {
//     return {
//         type:'CLEAR_BOOK',
//         payload: {
//             book: null,
//             updateBook:false,
//             postDeleted:false
//         }
//     }
// }

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




// two requests inside one action, book and user. user reduxthunk
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
                        // reviewer:data
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
        type:'CLEAR_ITEM_W_REVIEWER',
        payload:{
            item:{},
            reviewer:{}
        }
    }
}

// item arg is json data
export function addItem(item) {
    const request = axios.post('/api/item', item)
                        .then(response => response.data);
    

    return {
        type: 'ADD_ITEM',
        payload:request
    }
}


export function clearNewItem() {
    return {
        type:'CLEAR_NEWITEM',
        payload:null
    }
}

// // get every post of particular user
// export function getUserPosts(userId) {
//     const request = axios.get(`/api/user_posts?user=${userId}`)
//                         .then(response => response.data);
//     return {
//         type:'GET_USER_POSTS',
//         payload:request
//     }
// }



// // ended up not needing....

// export function getItemWithInfo(id) {

//     // reduxthunk's dispatched function sends payload to reducers whenever we are ready
//     // as an alternative to getItems
//     const request = axios.get(`/api/getItemById?id=${id}`)

//     // return a dispatch function
//     return (dispatch) => {

//         // get the promise, using {{{destructuring}}}
//         request.then(({data}) => {
//             let item = data;
//             // console.log(item);

//             // axios.get(`/api/getContributor?id=${item.ownerId}`)
//             // console.log(data);

//             // axios.get(`/api/getContributor?id=${item._id}`)
//             axios.get(`/api/getCatById?id=${item.something}`)

//                 .then(({data}) => {
                
//                     let response = {
//                         item, 
//                         // reviewer:data
//                         catinfo:data
//                     }

//                     // console.log(response);

//                     // only gets executed when ready
//                     dispatch({
//                         type:'GET_ITEM_W_INFO',
//                         payload:response
//                     })
//                 })
//         })
//     }
// }


export function getNextItem(oldId) {
    const request = axios.get(`/api/getNextItem?oldId=${oldId}`)
                        .then(response => {
                                return response.data
                            }
                        );

    // console.log(request);

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

    // console.log(request);

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

// * * * * * * * * * *  EDIT ITEMS * * * * * * * * * *  

export function getItemById(id) {
    const request = axios.get(`/api/getItemById?id=${id}`)
                        .then(response => response.data);

    return {
        type:'GET_ITEM',
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

export function deleteItem(id) {
    const request = axios.delete(`/api/delete_item?id=${id}`)
                        .then(response => response.data)
    return {
        type:'DELETE_ITEM',
        payload:request
    }
}




// ******************** COLLECTIONS ACTIONS ********************


export function getAllColls() {
    const request = axios.get(`/api/collections`)
                        .then(response => {
                                return response.data
                            }
                        );
return {
        type:'GET_ALL_COLLS',
        payload:request
    }
}





export function getCollById(id) {
    // console.log('getColl action called');
    const request = axios.get(`/api/getCollById?id=${id}`)
                        .then(response => response.data);

    // console.log(request);


    return {
        type:'GET_COLL',
        payload:request
    }
}


export function searchItem(key, value) {
    // console.log('searchItem action called');

    const request = axios.get(`/api/searchItem?key=${key}&value=${value}`)
    .then(response => response.data);

    // console.log(request);

    return {
        type:'SEARCH_ITEM',
        payload:request
    }


}


// decided not to use
export function getCollWithItems(collId) {


    const request = axios.get(`/api/getCollById?id=${collId}`)
        .then(response => response.data);


    return (dispatch) => {
        request.then( ({data}) => {
            let coll = data;

            axios.get(`/api/searchItem?id=${collId}`)
                .then( ({data}) => {
                    let response = {
                        coll,
                        items:data
                    }
                    dispatch({
                        type:'GET_COLL_W_ITEMS',
                        payload:response
                    })
                })
        })
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

            axios.get(`/api/getItemsByCat?value=${catInfo.cat_id}`)

                .then(({data}) => {
                
                    let response = {
                        catInfo, 
                        // reviewer:data
                        catItems:data
                    }

                    // console.log(response);


                    dispatch({
                        type:'GET_ITEMS_W_CAT',
                        payload:response
                    })
                })
        })
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