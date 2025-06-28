import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, username, firstName, lastName, password } = req.body;
  
  // Basic validation
  if (!email || !username || !firstName || !lastName || !password) {
    throw createError('All fields are required', 400);
  }
  
  const validatedData = { email, username, firstName, lastName, password };
  
  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  if (existingUser) {
    throw createError('User already exists with this email', 400);
  }

  // Check if username is taken
  const [existingUsername] = await db
    .select()
    .from(users)
    .where(eq(users.username, validatedData.username))
    .limit(1);

  if (existingUsername) {
    throw createError('Username is already taken', 400);
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email: validatedData.email,
      username: validatedData.username,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isEmailVerified: users.isEmailVerified,
      preferences: users.preferences,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  // Generate JWT token
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw createError('JWT secret not configured', 500);
  }

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '30d' });

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      token,
      refreshToken,
    },
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const validatedData = LoginSchema.parse(req.body);

  // Find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Generate JWT token
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw createError('JWT secret not configured', 500);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password from response
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token,
      refreshToken,
    },
  });
}));

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      avatar: users.avatar,
      role: users.role,
      isEmailVerified: users.isEmailVerified,
      preferences: users.preferences,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, req.user!.id))
    .limit(1);

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('Refresh token required', 400);
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw createError('JWT secret not configured', 500);
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    
    // Verify user still exists
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      throw createError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const newToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Set cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw createError('Invalid refresh token', 401);
  }
}));

export default router;
