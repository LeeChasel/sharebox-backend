import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
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
}

export default new App().app;
