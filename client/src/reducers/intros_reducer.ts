import { Intro } from '../types';

interface DefaultStateI {}

const defaultState: DefaultStateI = {}


interface UpdateItroTextAction {
    type: 'UPDATE_INTRO_TEXT';
    payload: {
        success: boolean;
        doc: Intro;
    };
}

interface GetIntroTextAction {
    type: 'GET_INTRO_TEXT';
    payload: Intro;
}

type Action = UpdateItroTextAction | GetIntroTextAction;

export default function foo(state: DefaultStateI = defaultState, action: Action): DefaultStateI {
    switch(action.type) {

        case 'UPDATE_INTRO_TEXT':
            return {
                ...state,
                updateTextSuccess:action.payload.success, 
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