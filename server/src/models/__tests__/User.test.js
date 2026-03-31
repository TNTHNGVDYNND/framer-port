import { describe, it, expect, beforeEach } from '@jest/globals';
import User from '../User.js';

describe('User Model', () => {
  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('Happy Path', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        role: 'user',
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('user');
      expect(user.password).not.toBe(userData.password);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should default role to "user"', async () => {
      const user = await User.create({
        email: 'default@example.com',
        password: 'SecurePass123',
      });

      expect(user.role).toBe('user');
    });

    it('should hash password before saving', async () => {
      const password = 'SecurePass123';
      const user = await User.create({
        email: 'hash@example.com',
        password,
      });

      expect(user.password).not.toBe(password);
      expect(user.password.length).toBeGreaterThan(20);
    });

    it('should correctly compare passwords', async () => {
      const password = 'SecurePass123';
      const user = await User.create({
        email: 'compare@example.com',
        password,
      });

      const isCorrect = await user.correctPassword(password, user.password);
      expect(isCorrect).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should require email', async () => {
      await expect(
        User.create({ password: 'SecurePass123' })
      ).rejects.toThrow('Please provide an email');
    });

    it('should require password', async () => {
      await expect(
        User.create({ email: 'test@example.com' })
      ).rejects.toThrow('Please provide a password');
    });

    it('should enforce minimum password length', async () => {
      await expect(
        User.create({
          email: 'test@example.com',
          password: 'short',
        })
      ).rejects.toThrow(/minimum/);
    });

    it('should enforce unique email', async () => {
      const email = 'unique@example.com';
      await User.create({ email, password: 'SecurePass123' });

      await expect(
        User.create({ email, password: 'AnotherPass123' })
      ).rejects.toThrow(/duplicate key/);
    });

    it('should lowercase email', async () => {
      const user = await User.create({
        email: 'UPPER@EXAMPLE.COM',
        password: 'SecurePass123',
      });

      expect(user.email).toBe('upper@example.com');
    });

    it('should trim whitespace from email', async () => {
      const user = await User.create({
        email: '  whitespace@example.com  ',
        password: 'SecurePass123',
      });

      expect(user.email).toBe('whitespace@example.com');
    });

    it('should validate role enum', async () => {
      await expect(
        User.create({
          email: 'role@example.com',
          password: 'SecurePass123',
          role: 'invalid-role',
        })
      ).rejects.toThrow(/validation failed/);
    });
  });

  describe('Security', () => {
    it('should not return password in queries by default', async () => {
      await User.create({
        email: 'secure@example.com',
        password: 'SecurePass123',
      });

      const found = await User.findOne({ email: 'secure@example.com' });
      expect(found.password).toBeUndefined();
    });

    it('should reject incorrect password comparison', async () => {
      const user = await User.create({
        email: 'wrong@example.com',
        password: 'SecurePass123',
      });

      const isCorrect = await user.correctPassword('WrongPassword123', user.password);
      expect(isCorrect).toBe(false);
    });

    it('should accept "admin" as valid role', async () => {
      const admin = await User.create({
        email: 'admin@example.com',
        password: 'SecurePass123',
        role: 'admin',
      });

      expect(admin.role).toBe('admin');
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt on creation', async () => {
      const user = await User.create({
        email: 'time@example.com',
        password: 'SecurePass123',
      });

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });
});
