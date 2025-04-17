import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'mood', 'journal'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedMoodReducer = persistReducer(persistConfig, moodReducer);
const persistedJournalReducer = persistReducer(persistConfig, journalReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    mood: persistedMoodReducer,
    journal: persistedJournalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 