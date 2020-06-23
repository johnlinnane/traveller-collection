export default function(state={}, action) {
    switch(action.type) {

        case 'GET_ALL_CATS':
            return { 
                ...state, 
                cats:action.payload 
            };
        case 'GET_ITEMS_BY_CAT':
            return { 
                ...state, 
                catitems:action.payload 
            };
        case 'GET_CAT_BY_ID':
            return { 
                ...state, 
                catinfo:action.payload 
        };
        case 'GET_ITEMS_W_CAT':
            return { 
                ...state, 
                catitems:action.payload 
        };

        // SUB_CATEGORIES
        case 'GET_ALL_SUBCATS':
            return { 
                ...state, 
                subcats:action.payload 
            };

        case 'GET_FIRST_ITEM_SUBCAT':
            return {
                ...state,
                firstitem: action.payload
            }

        case 'GET_ITEMS_BY_SUBCAT':
            return {
                ...state,
                subcatitems: action.payload
            }
        case 'GET_SUBCAT':
            console.log(action.payload);
            return {
                ...state,
                subcat: action.payload
            }


        default:
            return state;
    }
}