export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // 維持正確的 stack trace
    Error.captureStackTrace(this, this.constructor);

    // 設定 prototype 以支援 instanceof 檢查
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
