export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  bestWpm?: number;
  averageWpm?: number;
  averageAccuracy?: number;
  testsCompleted?: number;
}

export interface TypingTest {
  id: string;
  text: string;
  duration: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'words' | 'quotes' | 'code';
}

export interface TypingTestResult {
  id: string;
  userId?: string;
  wpm: number;
  accuracy: number;
  errors: number;
  totalCharacters: number;
  correctCharacters: number;
  duration: number;
  mode: string;
  text: string;
  createdAt: string;
}

export interface StatisticsSummary {
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  recentTests: TypingTestResult[];
}

export interface StatisticsTrend {
  date: string;
  wpm: number;
  accuracy: number;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type TestMode = 'words' | 'quotes' | 'code';
export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestDuration = 15 | 30 | 60 | 120;