import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
