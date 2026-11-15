const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      // Support "Bearer <token>", "Bearer Bearer <token>" (Swagger UI entry), or raw token
      token = authHeader.replace(/^(Bearer\s+)+/i, '').trim();

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No authentication token provided. Please log in at /api/auth/login and click Authorize.',
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_student_reg_hci_2026_secure'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied. No authentication token provided. In Swagger UI, log in via /api/auth/login first, then click the green "Authorize" button at the top and paste your token.',
  });
};

module.exports = { protect };

