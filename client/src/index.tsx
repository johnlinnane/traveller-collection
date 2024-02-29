import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import URLRoutes from './routes';
import catsSlice from './slices/catsSlice';
import infosSlice from './slices/infosSlice';
import introsSlice from './slices/introsSlice';
import itemsSlice from './slices/itemsSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
    reducer: {
        cats: catsSlice,
        infos: infosSlice,
        intros: introsSlice,
        items: itemsSlice,
        user: userSlice
    }
  });

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <URLRoutes />
        </BrowserRouter>
    </Provider>
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;