import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
