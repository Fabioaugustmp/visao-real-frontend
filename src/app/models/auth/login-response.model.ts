export interface LoginResponse {
  accessToken: string;
  tokenType: string; // Add tokenType as well
  // Add other properties if the API returns more data, e.g., user info
  // userId: string;
  // username: string;
}
