export const env = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'gamevault'
  }
});
