import axios from 'axios';
import { apiBaseUrl } from '../config';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
