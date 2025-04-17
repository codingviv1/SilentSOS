import axios from 'axios';
import { User, MoodEntry, JournalEntry } from '../types/state';

const API_URL = 'http://localhost:3000/api'; // TODO: Update with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Mood API
export const moodAPI = {
  getMoodEntries: async () => {
    const response = await api.get('/mood/entries');
    return response.data;
  },
  addMoodEntry: async (entry: Omit<MoodEntry, 'id'>) => {
    const response = await api.post('/mood/entries', entry);
    return response.data;
  },
};

// Journal API
export const journalAPI = {
  getJournalEntries: async () => {
    const response = await api.get('/journal/entries');
    return response.data;
  },
  addJournalEntry: async (entry: Omit<JournalEntry, 'id'>) => {
    const response = await api.post('/journal/entries', entry);
    return response.data;
  },
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 