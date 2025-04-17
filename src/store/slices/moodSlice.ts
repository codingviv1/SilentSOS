import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MoodEntry } from '../../types/state';

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  entries: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    addMoodEntry: (state, action: PayloadAction<MoodEntry>) => {
      state.entries.push(action.payload);
    },
    setMoodEntries: (state, action: PayloadAction<MoodEntry[]>) => {
      state.entries = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addMoodEntry, setMoodEntries, setLoading, setError } = moodSlice.actions;
export default moodSlice.reducer; 