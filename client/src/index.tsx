import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import Routes from './routes';

<<<<<<< HEAD:client/src/index.js
require('dotenv').config({path: '../../.env'})

const storeWithMiddleware = createStore(
    reducers, 
    applyMiddleware(promiseMiddleware, ReduxThunk)
=======
const storeWithMiddleware: any = createStore(
    reducers, 
    applyMiddleware(promiseMiddleware, thunkMiddleware)
>>>>>>> typescript-refactor:client/src/index.tsx
);

ReactDOM.render(
    <Provider store={storeWithMiddleware}>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);