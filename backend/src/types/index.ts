export interface JwtPayload {
  id: string;
  role: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
