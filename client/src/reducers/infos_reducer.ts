interface DefaultStateI {}

const defaultState: DefaultStateI = {}

export default function foo(state: DefaultStateI = defaultState, action: any): DefaultStateI {
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