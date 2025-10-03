export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}
