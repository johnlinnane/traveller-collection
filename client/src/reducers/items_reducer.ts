interface DefaultStateI {}

const defaultState: DefaultStateI = {}

export default function foo(state: DefaultStateI = defaultState, action: any): DefaultStateI {
    switch(action.type) {
        case 'GET_ITEMS':
            return { 
                ...state,
                list:action.payload 
            };
        case 'GET_ITEM':
            return {
                ...state,
                item:action.payload
            };
        case 'GET_PEND_ITEM':
            return {
                ...state,
                item:action.payload
            };
        case 'GET_PARENT_PDF':
            return {
                ...state,
                parentpdf:action.payload
            };
        case 'GET_ALL_ITEMS':
            return {
                ...state,
                items:action.payload
            };
        case 'GET_ALL_PEND_ITEMS':
            return {
                ...state,
                items:action.payload
            };
        case 'DELETE_CHAPT':
            return {
                ...state,
                chaptDeleted:action.payload
            };
        case 'GET_ITEM_OR_PENDING':
            return {
                ...state,
                item:action.payload.item,
                error:action.payload.error
            };
        case 'CLEAR_ITEM_W_CONTRIBUTOR': 
            return {
                ...state,
                item:action.payload.item,
                contributor:action.payload.contributor
            };
        case 'CREATE_ITEM':
            return {
                ...state,
                newitem:action.payload
            };
        case 'CREATE_PEND_ITEM':
            return {
                ...state,
                newitem:action.payload
            };
        case 'CLEAR_NEWITEM':
            return {
                ...state,
                newitem:action.payload
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                updateItem:action.payload.success,  // for update message
                item:action.payload.doc
            }
        case 'UPDATE_PEND_ITEM':
            return {
                ...state,
                updateItem:action.payload.success,  // for update message
                item:action.payload.doc
            }
        case 'DELETE_ITEM':
            return {
                ...state,
                postDeleted:action.payload
            }
        case 'DEL_PEND_ITEM':
            return {
                ...state,
                postDeleted:action.payload
            }
        case 'CLEAR_ITEM':
            return {
                ...state,
                updateItem:action.payload.updateItem,
                item:action.payload.item,
                postDeleted:action.payload.postDeleted
            }
        case 'SEARCH_ITEM':
            return {
                ...state,
                data:action.payload
            }
        case 'GET_NEXT_ITEM':
            return {
                ...state,
                nextitem:action.payload
            }
        case 'GET_PREV_ITEM':
            return {
                ...state,
                previtem:action.payload
            }
        case 'GET_ITEMS_W_COORDS':
            return {
                ...state,
                items:action.payload
            }
        case 'ACCEPT_ITEM':
            return {
                ...state
            }
        case 'GET_FILES_FOLDER':
            return {
                ...state,
                files:action.payload
            }
        default:
            return state;
    }
}