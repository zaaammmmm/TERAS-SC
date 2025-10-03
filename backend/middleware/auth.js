import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const user = await User.findOne({ apiToken: token }).select('-password');

    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export { admin, protect };

