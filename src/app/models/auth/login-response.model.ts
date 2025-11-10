export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  roles: string[]; // Add roles property
  // Add other properties if the API returns more data, e.g., user info
  // userId: string;
  // username: string;
}
