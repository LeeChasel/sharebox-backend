import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './shared/middlewares/error.middleware';
import { notFoundHandler } from './shared/middlewares/not-found.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();

    // Called after routes to handle 404 and errors
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security Middlewares
    this.app.use(helmet());
    this.app.use(cors());

    // Body Parsing Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging Middleware
    if (env.NODE_ENV === 'production') {
      this.app.use(morgan('combined'));
    } else {
      this.app.use(morgan('dev'));
    }
  }

  private initializeRoutes() {
    // health check route
    this.app.get('/health', (_, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  private initializeErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
