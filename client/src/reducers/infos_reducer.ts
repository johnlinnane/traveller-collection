import { Info } from '../types';

interface DefaultStateI {}

const defaultState: DefaultStateI = {}

interface UpdateInfoTextAction {
    type: 'UPDATE_INFO_TEXT';
    payload: {
        success: boolean;
        doc: Info;
    };
}

interface GetInfoTextAction {
    type: 'GET_INFO_TEXT';
    payload: Info;
}

type Action = UpdateInfoTextAction | GetInfoTextAction;

export default function foo(state: DefaultStateI = defaultState, action: any): DefaultStateI {
    switch(action.type) {

        case 'UPDATE_INFO_TEXT':
            return {
                ...state,
                updateInfoTextSuccess:action.payload.success,
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