import type { ValidationErrorDetail } from '../types/error-response.types';
import { AppError } from './app-error';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: ValidationErrorDetail[]) {
    super(message, 400, 'VALIDATION_ERROR', details);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
