import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JournalEntry } from '../../types/state';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  entries: [],
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addJournalEntry: (state, action: PayloadAction<JournalEntry>) => {
      state.entries.push(action.payload);
    },
    setJournalEntries: (state, action: PayloadAction<JournalEntry[]>) => {
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

export const { addJournalEntry, setJournalEntries, setLoading, setError } = journalSlice.actions;
export default journalSlice.reducer; 