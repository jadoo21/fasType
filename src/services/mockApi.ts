import { User, TypingTestResult, StatisticsSummary, StatisticsTrend, ContactRequest, ApiResponse, LoginRequest, SignupRequest } from '../types';

// Simulated delay for mock API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
const mockUsers: Map<string, User & { password: string }> = new Map();
const mockResults: TypingTestResult[] = [];

// Initialize with some sample data
const initMockData = () => {
  if (mockUsers.size === 0) {
    mockUsers.set('demo@fastype.dev', {
      id: '1',
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: '2024-01-01T00:00:00Z',
      bestWpm: 78,
      averageWpm: 70,
      averageAccuracy: 96,
      testsCompleted: 6,
      password: 'demo123',
    });
  }

  if (mockResults.length === 0) {
    const sampleResults: TypingTestResult[] = [
      { id: '1', userId: '1', wpm: 78, accuracy: 97, errors: 2, totalCharacters: 390, correctCharacters: 388, duration: 30, mode: '30s / Words', text: 'sample text', createdAt: '2026-09-06T14:32:00Z' },
      { id: '2', userId: '1', wpm: 72, accuracy: 98, errors: 1, totalCharacters: 360, correctCharacters: 359, duration: 30, mode: '30s / Words', text: 'sample text', createdAt: '2026-09-05T11:15:00Z' },
      { id: '3', userId: '1', wpm: 67, accuracy: 95, errors: 4, totalCharacters: 335, correctCharacters: 331, duration: 60, mode: '60s / Quotes', text: 'sample text', createdAt: '2026-09-03T19:40:00Z' },
      { id: '4', userId: '1', wpm: 61, accuracy: 93, errors: 6, totalCharacters: 305, correctCharacters: 299, duration: 60, mode: '60s / Code', text: 'sample text', createdAt: '2026-09-01T16:10:00Z' },
      { id: '5', userId: '1', wpm: 75, accuracy: 96, errors: 3, totalCharacters: 375, correctCharacters: 372, duration: 30, mode: '30s / Words', text: 'sample text', createdAt: '2026-08-30T08:20:00Z' },
      { id: '6', userId: '1', wpm: 69, accuracy: 94, errors: 5, totalCharacters: 345, correctCharacters: 340, duration: 60, mode: '60s / Quotes', text: 'sample text', createdAt: '2026-08-28T17:10:00Z' },
    ];
    mockResults.push(...sampleResults);
  }
};

initMockData();

// Auth API
export const authApi = {
  login: async ({ email, password }: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(800);
    const user = mockUsers.get(email) || Array.from(mockUsers.values()).find(candidate => candidate.username === email);
    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid email or password combination' };
    }
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, data: { user: userWithoutPassword, token: 'mock-jwt-token-' + Date.now() } };
  },

  signup: async (data: SignupRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);
    if (mockUsers.has(data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      firstName: data.username,
      createdAt: new Date().toISOString(),
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      testsCompleted: 0,
      password: data.password,
    };
    mockUsers.set(data.email, newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, data: { user: userWithoutPassword, token: 'mock-jwt-token-' + Date.now() } };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(300);
    return { success: true };
  },
};

// Statistics API
export const statisticsApi = {
  getSummary: async (userId: string): Promise<ApiResponse<StatisticsSummary>> => {
    await delay(500);
    const userResults = mockResults.filter(r => r.userId === userId);
    if (userResults.length === 0) {
      return { success: true, data: { bestWpm: 0, averageWpm: 0, averageAccuracy: 0, testsCompleted: 0, recentTests: [] } };
    }
    const bestWpm = Math.max(...userResults.map(r => r.wpm));
    const averageWpm = Math.round(userResults.reduce((sum, r) => sum + r.wpm, 0) / userResults.length);
    const averageAccuracy = Math.round(userResults.reduce((sum, r) => sum + r.accuracy, 0) / userResults.length);
    return {
      success: true,
      data: {
        bestWpm,
        averageWpm,
        averageAccuracy,
        testsCompleted: userResults.length,
        recentTests: userResults.slice(0, 4),
      },
    };
  },

  getTrend: async (userId: string, _days: number = 30): Promise<ApiResponse<StatisticsTrend[]>> => {
    await delay(400);
    const userResults = mockResults.filter(result => result.userId === userId).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const trend: StatisticsTrend[] = userResults.slice(-Math.max(1, _days)).map(result => ({
      date: result.createdAt.slice(0, 10), wpm: result.wpm, accuracy: result.accuracy,
    }));
    return { success: true, data: trend };
  },
};

// Typing Test API
export const typingTestApi = {
  submitResult: async (result: Omit<TypingTestResult, 'id' | 'createdAt'>): Promise<ApiResponse<TypingTestResult>> => {
    await delay(600);
    const newResult: TypingTestResult = {
      ...result,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    mockResults.push(newResult);
    return { success: true, data: newResult };
  },

  getResults: async (userId: string): Promise<ApiResponse<TypingTestResult[]>> => {
    await delay(300);
    const userResults = mockResults.filter(r => r.userId === userId);
    return { success: true, data: userResults };
  },
};

// Contact API
export const contactApi = {
  submit: async (data: ContactRequest): Promise<ApiResponse<null>> => {
    await delay(1000);
    // Simulate occasional failure
    if (Math.random() < 0.1) {
      return { success: false, error: 'Failed to send message. Please try again.' };
    }
    return { success: true };
  },
};
