export default function(state={}, action) {
    switch(action.type) {

        case 'GET_ALL_COLLS':
            return { 
                ...state, 
                colls:action.payload 
            };
        case 'GET_COLL':
            return { 
                ...state, 
                coll:action.payload 
            };
        case 'GET_COLL_W_ITEMS':
            return {
                ...state,
                collitems:action.payload
            };
    
        default:
            return state;
    }
}