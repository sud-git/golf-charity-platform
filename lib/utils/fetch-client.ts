// lib/utils/fetch-client.ts
// Helper for making authenticated API requests

export async function fetchAPI(
  url: string,
  options: RequestInit & { userId?: string } = {}
) {
  const { userId, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  
  // Add authentication headers if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const userIdHeader = userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (userIdHeader) {
    headers.set('x-user-id', userIdHeader);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API Error: ${response.status}`);
  }

  return data;
}
