// server.js
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cp_db',
  connectionLimit: 10
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  }
}

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (err) {
    console.error('Database Error Details:', err.message);
    console.error('Error Code:', err.code);
    res.status(500).json({ 
      success: false,
      error: 'Database error',
      details: err.message
    });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Database error'
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ 
      success: true, 
      message: 'Server and database are healthy',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({ 
      success: false, 
      error: 'Database connection failed' 
    });
  }
});

// Start server
async function startServer() {
  await testConnection();
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});