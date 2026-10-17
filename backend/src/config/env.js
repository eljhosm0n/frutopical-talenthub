import 'dotenv/config';

const required = ['DB_HOST', 'DB_NAME', 'DB_USER'];

export function environment() {
  const absent = required.filter((key) => !process.env[key]);
  if (absent.length) throw new Error(`Faltan variables de entorno: ${absent.join(', ')}`);
  return {
    port: Number(process.env.PORT ?? 3000),
    clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    db: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ?? ''
    }
  };
}
