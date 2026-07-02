const getAPIURL = () => {
  // Use environment variable if set (for production/custom deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // If we're on localhost dev server, use localhost backend directly
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // For ngrok and other remote URLs, use relative paths (requires proxy in Vite)
  // This works with the Vite proxy configuration that forwards /api/* to backend
  if (hostname.includes('ngrok') || hostname.includes('github.dev')) {
    return '';  // Empty string means use relative paths - /api/* will be proxied
  }

  // For other deployments (VMs, servers), try same host with port 3000
  return `${protocol}//${hostname}:3000`;
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
