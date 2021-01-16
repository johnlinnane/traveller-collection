export default function foo(state={}, action) {
    switch(action.type) {

        case 'UPDATE_INTRO_TEXT':
            return {
                ...state,
                updateTextSuccess:action.payload.success,  // for update message
                introText:action.payload.doc
            }
        case 'GET_INTRO_TEXT':
            return {
                ...state,
                text:action.payload
            };
        default:
            return state;
    }
}