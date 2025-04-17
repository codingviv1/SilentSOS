export interface User {
  id: string;
  email: string;
  name: string;
}

export interface MoodEntry {
  id: string;
  moodRating: number;
  energyLevel: number;
  stressLevel: number;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  content: string;
  sentiment: string;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  loading: boolean;
  error: string | null;
} 