import crypto from 'crypto';
import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { protect } from '../middleware/auth.js';
import SsoHandoff from '../models/SsoHandoff.js';
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
    if (!identifier || typeof password !== 'string' || !password) {
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

// @desc    Exchange a short-lived My-SUKA handoff token for a TERAS-SC API token
// @route   POST /auth/sso
// @access  Public (the signed, service-scoped handoff token is the credential)
router.post('/sso', async (req, res) => {
  const handoffToken = req.body?.token;
  if (typeof handoffToken !== 'string' || !handoffToken) {
    return res.status(400).json({ message: 'SSO token wajib diisi' });
  }

  const jwksUrl = process.env.MYSUKA_JWKS_URL;
  const issuer = process.env.MYSUKA_ISSUER;
  if (!jwksUrl || !issuer) {
    console.error('SSO configuration missing: MYSUKA_JWKS_URL / MYSUKA_ISSUER');
    return res.status(503).json({ message: 'SSO belum dikonfigurasi' });
  }

  try {
    const parsedJwksUrl = new URL(jwksUrl);
    if (parsedJwksUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ message: 'Konfigurasi JWKS harus menggunakan HTTPS' });
    }
    const jwks = createRemoteJWKSet(parsedJwksUrl);
    const { payload } = await jwtVerify(handoffToken, jwks, {
      algorithms: ['RS256'],
      issuer,
      audience: process.env.MYSUKA_AUDIENCE || 'mysuka-microapps-ecosystem',
      clockTolerance: 5,
    });

    const identity = payload.user;
    if (
      payload.svc !== 'terassc' ||
      typeof payload.sub !== 'string' ||
      typeof payload.jti !== 'string' ||
      !Number.isInteger(payload.exp) ||
      !identity ||
      typeof identity !== 'object' ||
      Array.isArray(identity) ||
      typeof identity.id !== 'string' ||
      identity.id !== payload.sub ||
      typeof identity.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email) ||
      typeof identity.name !== 'string' ||
      typeof identity.primary_role !== 'string'
    ) {
      return res.status(401).json({ message: 'Token SSO tidak valid untuk TERAS-SC' });
    }

    // The unique jti index makes each handoff token single-use, including concurrent requests.
    try {
      await SsoHandoff.create({
        jti: payload.jti,
        expiresAt: new Date(payload.exp * 1000),
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(401).json({ message: 'Token SSO sudah pernah digunakan' });
      }
      throw error;
    }

    const email = identity.email.trim().toLowerCase();
    let user = await User.findOne({ ssoId: identity.id });
    if (!user) {
      const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      user = await User.findOne({
        email: { $regex: `^${escapedEmail}$`, $options: 'i' },
      });

      if (user && user.ssoId && user.ssoId !== identity.id) {
        return res.status(409).json({ message: 'Email sudah terhubung ke identitas SSO lain' });
      }
      if (!user) {
        user = new User({
          email,
          name: identity.name.trim() || email,
          role: identity.primary_role === 'ADMIN' ? 'admin' : 'user',
          ssoId: identity.id,
        });
      } else {
        user.ssoId = identity.id;
        if (!user.name) user.name = identity.name.trim() || email;
        if (identity.primary_role === 'ADMIN') user.role = 'admin';
      }
    } else {
      user.email = email;
      user.name = identity.name.trim() || user.name;
      if (identity.primary_role === 'ADMIN') user.role = 'admin';
    }

    const apiToken = crypto.randomBytes(32).toString('hex');
    user.apiToken = apiToken;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: apiToken,
    });
  } catch (error) {
    if (
      error?.code === 'ERR_JWT_EXPIRED' ||
      error?.code === 'ERR_JWS_INVALID' ||
      error?.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED' ||
      error?.code === 'ERR_JWKS_NO_MATCHING_KEY'
    ) {
      return res.status(401).json({ message: 'Token SSO tidak valid atau sudah kedaluwarsa' });
    }
    console.error('SSO exchange failed:', error.message);
    return res.status(401).json({ message: 'Verifikasi SSO gagal' });
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