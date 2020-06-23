export default function(state={}, action) {
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
        
        case 'GET_ALL_ITEMS':
            return {
                ...state,
                items:action.payload
            };


        case 'GET_ITEM_W_CONTRIBUTOR':
            return {
                ...state,
                item:action.payload.item,
                contributor:action.payload.contributor
            };
        
        case 'CLEAR_ITEM_W_CONTRIBUTOR': 
            return {
                ...state,
                item:action.payload.item,
                contributor:action.payload.contributor
            };
        
        case 'ADD_ITEM':
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

        case 'DELETE_ITEM':
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

        case 'GET_LATEST_ITEM':
            return {
                ...state,
                latest:action.payload
            }

       
    
        default:
            return state;
    }
}