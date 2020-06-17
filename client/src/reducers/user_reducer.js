export default function(state={}, action) {
    switch(action.type) {

        case 'USER_LOGIN':
            return { ...state, login:action.payload }

        case 'USER_AUTH':
            return { ...state, login:action.payload }

        case 'GET_USER_POSTS':
            return {...state, userPosts:action.payload }

        case 'GET_USER_ITEMS':
            return {...state, userItems:action.payload }

        case 'GET_USER':
            return {...state, users:action.payload}

        case 'USER_REGISTER':
            return {
                ...state, 
                register:action.payload.success,
                users:action.payload.users    // new users
            }

        default:
            return state;
    }
}