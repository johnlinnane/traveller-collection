import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import Routes from './routes';

const storeWithMiddleware: any = createStore(
    reducers, 
    applyMiddleware(promiseMiddleware, thunkMiddleware)
);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={storeWithMiddleware}>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </Provider>
);