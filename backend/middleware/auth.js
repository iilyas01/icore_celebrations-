const jwt = require('jsonwebtoken');
// export this function to be used as middleware in routes that require authentication
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
 // if no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
// verify the token and extract user information 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // request object now has user_id and role from the token payload 
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};