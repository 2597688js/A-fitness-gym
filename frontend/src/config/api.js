const getAPIURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }

  return `${protocol}//${hostname}:5001`;
};

export const API_URL = getAPIURL();

// Helper function to build API endpoint URLs
export const getApiEndpoint = (path) => {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  if (API_URL) {
    return `${API_URL}${path}`;
  }

  // For relative URLs (ngrok with proxy)
  return path;
};

// Log for debugging
if (typeof window !== 'undefined') {
  console.log('API_URL:', API_URL || 'relative (/api)');
}
