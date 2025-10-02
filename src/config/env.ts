import z from 'zod';

const DEFAULT_SERVER_PORT = 8080;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SERVER_PORT: z.coerce.number().int().min(1).max(65535).default(DEFAULT_SERVER_PORT),
  DB_NAME: z.string().min(1),
  DB_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('Invalid environment variables:\n', z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;
