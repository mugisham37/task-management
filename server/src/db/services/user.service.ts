import { eq, and, desc, count, ilike } from 'drizzle-orm';
import { db, PaginationOptions, PaginatedResult } from './base.service';
import { users, User, NewUser } from '../schema/users';

export class UserService {
  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  }

  async findMany(options: PaginationOptions = {}): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(users);
    
    const total = totalResult[0]?.count || 0;
    
    // Get data with pagination
    const orderBy = sortOrder === 'asc' ? 
      asc(users[sortBy as keyof typeof users] || users.createdAt) : 
      desc(users[sortBy as keyof typeof users] || users.createdAt);
    
    const data = await db
      .select()
      .from(users)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async create(data: NewUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(data)
      .returning();
    
    return result[0];
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    
    return (result.rowCount || 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result.length > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0;
  }

  async search(query: string, options: PaginationOptions = {}): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    const whereClause = ilike(users.name, searchPattern);
    
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;
    
    // Get data with pagination
    const orderBy = sortOrder === 'asc' ? 
      asc(users[sortBy as keyof typeof users] || users.createdAt) : 
      desc(users[sortBy as keyof typeof users] || users.createdAt);
    
    const data = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async verifyEmail(id: string): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ 
        isEmailVerified: true, 
        verificationToken: null,
        verificationTokenExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    
    return result[0] || null;
  }

  async setResetToken(id: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: token,
        resetPasswordExpires: expires,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  async clearResetToken(id: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  async deactivate(id: string): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0] || null;
  }

  async activate(id: string): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0] || null;
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    verified: number;
    admins: number;
  }> {
    const [totalResult, activeResult, verifiedResult, adminResult] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(users).where(eq(users.isActive, true)),
      db.select({ count: count() }).from(users).where(eq(users.isEmailVerified, true)),
      db.select({ count: count() }).from(users).where(eq(users.role, 'admin')),
    ]);

    return {
      total: totalResult[0]?.count || 0,
      active: activeResult[0]?.count || 0,
      verified: verifiedResult[0]?.count || 0,
      admins: adminResult[0]?.count || 0,
    };
  }
}

export const userService = new UserService();
