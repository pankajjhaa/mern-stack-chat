import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query';
import {chatApi} from "../features/chat/chat.api.js";
import {authApi} from "../features/auth/auth.api.js";
import userReducer from '../features/user/user.slice.js'
import searchReducer from '../features/user/search.slice.js'
import selectedChatReducer from '../features/chat/chat.slice.js'
import storage from 'redux-persist/lib/storage';
import {
    FLUSH,
    PAUSE,
    PERSIST, persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist';
import {userApi} from "../features/user/user.api.js";


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'selectedChat']
}


const rootReducer = combineReducers({
    user: userReducer,
    selectedChat: selectedChatReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    // reducerPath and reducer are created for us, which we can pass straight into the reducer parameter of configureStore.
    reducer: {
        persistedReducer,
        search: searchReducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },

    // middleware is also created for us, which will allow us to take advantage of caching, invalidation, polling, and the other features of RTK Query.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(chatApi.middleware, authApi.middleware, userApi.middleware),
})

export const persistor = persistStore(store)
setupListeners(store.dispatch)

