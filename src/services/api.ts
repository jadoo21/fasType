import { apiMode } from '../config';
import {
  ApiResponse,
  ContactRequest,
  LoginRequest,
  SignupRequest,
  StatisticsSummary,
  StatisticsTrend,
  TypingTestResult,
  User,
} from '../types';
import { authApi as mockAuthApi, contactApi as mockContactApi, statisticsApi as mockStatisticsApi, typingTestApi as mockTypingTestApi } from './mockApi';

const getApiClient = () => require('../api/apiClient').default;

const realAuthApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await getApiClient().post('/login', credentials);
    return response.data;
  },
  signup: async (data: SignupRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await getApiClient().post('/signup', data);
    return response.data;
  },
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await getApiClient().post('/logout');
    return response.data;
  },
};

const realStatisticsApi = {
  getSummary: async (userId: string): Promise<ApiResponse<StatisticsSummary>> => {
    const response = await getApiClient().get(`/users/${userId}/statistics`);
    return response.data;
  },
  getTrend: async (userId: string, days: number): Promise<ApiResponse<StatisticsTrend[]>> => {
    const response = await getApiClient().get(`/users/${userId}/statistics/trend`, { params: { days } });
    return response.data;
  },
};

const realTypingTestApi = {
  submitResult: async (result: Omit<TypingTestResult, 'id' | 'createdAt'>): Promise<ApiResponse<TypingTestResult>> => {
    const response = await getApiClient().post('/typing-tests/results', result);
    return response.data;
  },
};

const realContactApi = {
  submit: async (data: ContactRequest): Promise<ApiResponse<null>> => {
    const response = await getApiClient().post('/contact', data);
    return response.data;
  },
};

export const authApi = apiMode === 'mock' ? mockAuthApi : realAuthApi;
export const statisticsApi = apiMode === 'mock' ? mockStatisticsApi : realStatisticsApi;
export const typingTestApi = apiMode === 'mock' ? mockTypingTestApi : realTypingTestApi;
export const contactApi = apiMode === 'mock' ? mockContactApi : realContactApi;
