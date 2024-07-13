const fetch = require('node-fetch');

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token from header:', token);

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    const payload = await response.json();
    console.log('Token payload:', payload);

    req.userId = payload.sub;
    console.log('User ID:', req.userId);
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { verifyUser };
