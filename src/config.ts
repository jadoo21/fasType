export type ApiMode = 'mock' | 'real';

const configuredApiMode = process.env.REACT_APP_API_MODE;

if (configuredApiMode && configuredApiMode !== 'mock' && configuredApiMode !== 'real') {
  throw new Error('REACT_APP_API_MODE must be either "mock" or "real".');
}

export const apiMode: ApiMode = configuredApiMode === 'real' ? 'real' : 'mock';
export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (apiMode === 'real' && !apiBaseUrl) {
  throw new Error('REACT_APP_API_BASE_URL is required when REACT_APP_API_MODE is "real".');
}
