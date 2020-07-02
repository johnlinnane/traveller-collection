export default function(state={}, action) {
    switch(action.type) {

        case 'UPDATE_INFO_TEXT':
            return {
                ...state,
                updateInfoTextSuccess:action.payload.success,  // for update message
                infoText:action.payload.doc
            }
        case 'GET_INFO_TEXT':
            return {
                ...state,
                text:action.payload
            };
        default:
            return state;
    }
}