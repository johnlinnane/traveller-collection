interface DefaultStateI {}

const defaultState: DefaultStateI = {}

export default function foo(state: DefaultStateI = defaultState, action: any): DefaultStateI {
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