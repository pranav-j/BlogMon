import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchSlice from "./searchSlice";

import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, authReducer); 

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        search: searchSlice
    }
});

export const persistor = persistStore(store);