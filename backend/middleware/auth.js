const jwt = require('jsonwebtoken');
const db = require('../config/database');

const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token exists in sessions table
    const session = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM sessions WHERE token = ? AND expires_at > datetime("now")',
        [token],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });

    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user and token to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
}; 