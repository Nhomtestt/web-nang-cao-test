const fs = require('node:fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const ssl = process.env.DB_CA_PATH
  ? { ca: fs.readFileSync(process.env.DB_CA_PATH), rejectUnauthorized: true }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

const query = (sql, params) => pool.query(sql, params);
const close = () => pool.end();

module.exports = { pool, query, close };
