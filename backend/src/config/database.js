import mysql from 'mysql2/promise';
import { environment } from './env.js';

const { db } = environment();

export const pool = mysql.createPool({
  ...db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

export async function checkDatabase() {
  await pool.query('SELECT 1');
}
