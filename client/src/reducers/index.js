import { combineReducers } from 'redux';
import user from './user_reducer';
import items from './items_reducer';
import cats from './cats_reducer';
import intros from './intros_reducer';
import infos from './infos_reducer';

const rootReducer = combineReducers({
    user,
    items,
    cats,
    intros,
    infos
});

export default rootReducer;