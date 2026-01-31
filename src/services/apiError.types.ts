export interface BackendErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}
