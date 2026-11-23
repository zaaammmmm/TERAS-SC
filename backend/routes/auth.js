import crypto from 'crypto';
import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const identifier = (req.body.identifier ?? req.body.email ?? '').trim().toLowerCase();
  const password = req.body.password;

  console.log('Login route hit');

  try {
    if (!identifier) {
      return res.status(400).json({ message: 'NIM atau email harus diisi' });
    }

    const loginEmail = identifier.includes('@')
      ? identifier
      : `${identifier}@student.uin-suka.ac.id`;

    const escapedEmail = loginEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: 'i' },
    });

    if (user) {
      const passwordMatches = await user.matchPassword(password);
      console.log('Password match result:', passwordMatches);

      if (passwordMatches) {
        console.log('Generating token');
        let apiToken;
        let tokenSaved = false;
        for (let i = 0; i < 5; i++) {
          apiToken = crypto.randomBytes(32).toString('hex');
          user.apiToken = apiToken;
          try {
            await user.save();
            console.log('Token saved');
            tokenSaved = true;
            break;
          } catch (err) {
            console.log('Error saving token:', err);
            if (err.code === 11000 && err.keyPattern && err.keyPattern.apiToken) {
              console.log('Duplicate token, retrying');
              continue;
            } else {
              throw err;
            }
          }
        }
        if (!tokenSaved) {
          console.log('Failed to save unique token');
          return res.status(500).json({ message: 'Failed to generate unique token' });
        }

        console.log('Login successful, sending response');
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: apiToken,
        });
      } else {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    req.user.apiToken = undefined;
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;