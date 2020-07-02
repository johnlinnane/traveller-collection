import { combineReducers } from 'redux';

// import books from './books_reducer';
import user from './user_reducer';
import items from './items_reducer';
import collections from './colls_reducer';
import cats from './cats_reducer';
import intros from './intros_reducer';





const rootReducer = combineReducers({
    // books,
    user,
    items,
    collections,
    cats,
    intros
});


export default rootReducer;