import type http from 'node:http';
import app from './app';
import { connectToDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

class Server {
  private port: number;

  constructor() {
    this.port = env.SERVER_PORT;
  }

  public async start(): Promise<void> {
    let server: http.Server | undefined;

    try {
      await this.connectDatabase();

      server = app.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
      });

      this.setupGracefulShutdown(server);
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    } finally {
      if (!server) {
        await disconnectDatabase();
      }
    }
  }

  private async connectDatabase(): Promise<void> {
    try {
      await connectToDatabase();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  private setupGracefulShutdown(server: http.Server): void {
    let isShuttingDown = false;

    const gracefulExit = async (event: string, exitCode: 0 | 1) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`${event} received, closing server gracefully...`);
      server.close(async () => {
        console.log('Server closed');
        try {
          await disconnectDatabase();
          console.log('Database disconnected');
        } catch (error) {
          console.error('Error during database disconnection:', error);
        }
        process.exit(exitCode);
      });
    };

    // System Signals
    process.on('SIGTERM', () => {
      gracefulExit('SIGTERM', 0);
    });
    process.on('SIGINT', () => {
      gracefulExit('SIGINT', 0);
    });

    // unhandled Promise rejection
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulExit('unhandledRejection', 1);
    });

    // uncaught Exception
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulExit('uncaughtException', 1);
    });
  }
}

const server = new Server();
server.start();
