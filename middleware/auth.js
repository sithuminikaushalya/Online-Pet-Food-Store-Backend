import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header, ensuring it starts with 'Bearer'
  const authHeader = req.headers.authorization;
  
  // Debugging log to check if token exists in the headers
  console.log('Authorization header:', authHeader); 

  // If no authorization header or it's malformed, return an error
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication failed. No token provided.' });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  // Log token for debugging purposes (only for development, avoid logging tokens in production)
  console.log('Token received in middleware:', token);  

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded information (like admin ID) to the request object
    req.user = decoded;  // You might use req.admin if this is specifically for admin authentication

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Log the error if token verification fails
    console.error('Token verification failed:', err);

    // Respond with a 401 error if token is invalid or expired
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
