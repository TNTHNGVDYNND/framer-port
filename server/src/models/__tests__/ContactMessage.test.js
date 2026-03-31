import { describe, it, expect, beforeEach } from '@jest/globals';
import ContactMessage from '../ContactMessage.js';

describe('ContactMessage Model', () => {
  beforeEach(async () => {
    await ContactMessage.deleteMany({});
  });

  describe('Happy Path', () => {
    it('should create a new contact message with valid data', async () => {
      const messageData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is at least 10 characters long',
      };

      const message = await ContactMessage.create(messageData);

      expect(message).toBeDefined();
      expect(message.name).toBe(messageData.name);
      expect(message.email).toBe(messageData.email);
      expect(message.message).toBe(messageData.message);
      expect(message.read).toBe(false);
      expect(message.createdAt).toBeDefined();
    });

    it('should default read status to false', async () => {
      const message = await ContactMessage.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'This is a test message that is at least 10 characters long',
      });

      expect(message.read).toBe(false);
    });

    it('should allow creating read messages', async () => {
      const message = await ContactMessage.create({
        name: 'Admin User',
        email: 'admin@example.com',
        message: 'This is a test message that is at least 10 characters long',
        read: true,
      });

      expect(message.read).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should require name', async () => {
      await expect(
        ContactMessage.create({
          email: 'test@example.com',
          message: 'This is a test message that is at least 10 characters long',
        })
      ).rejects.toThrow(/Name is required/);
    });

    it('should require email', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          message: 'This is a test message that is at least 10 characters long',
        })
      ).rejects.toThrow(/Email is required/);
    });

    it('should require message', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
        })
      ).rejects.toThrow(/Message is required/);
    });

    it('should enforce minimum name length (2 characters)', async () => {
      await expect(
        ContactMessage.create({
          name: 'a',
          email: 'test@example.com',
          message: 'This is a test message that is at least 10 characters long',
        })
      ).rejects.toThrow(/at least 2 characters/);
    });

    it('should enforce maximum name length (100 characters)', async () => {
      await expect(
        ContactMessage.create({
          name: 'a'.repeat(101),
          email: 'test@example.com',
          message: 'This is a test message that is at least 10 characters long',
        })
      ).rejects.toThrow(/cannot exceed 100 characters/);
    });

    it('should enforce minimum message length (10 characters)', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Short',
        })
      ).rejects.toThrow(/at least 10 characters/);
    });

    it('should enforce maximum message length (1000 characters)', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
          message: 'a'.repeat(1001),
        })
      ).rejects.toThrow(/cannot exceed 1000 characters/);
    });
  });

  describe('Data Processing', () => {
    it('should trim whitespace from name', async () => {
      const message = await ContactMessage.create({
        name: '  John Doe  ',
        email: 'john@example.com',
        message: 'This is a test message that is at least 10 characters long',
      });

      expect(message.name).toBe('John Doe');
    });

    it('should trim whitespace from email', async () => {
      const message = await ContactMessage.create({
        name: 'John Doe',
        email: '  john@example.com  ',
        message: 'This is a test message that is at least 10 characters long',
      });

      expect(message.email).toBe('john@example.com');
    });

    it('should lowercase email', async () => {
      const message = await ContactMessage.create({
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        message: 'This is a test message that is at least 10 characters long',
      });

      expect(message.email).toBe('john@example.com');
    });

    it('should trim whitespace from message', async () => {
      const message = await ContactMessage.create({
        name: 'John Doe',
        email: 'john@example.com',
        message: '  This is a test message that is at least 10 characters long  ',
      });

      expect(message.message).toBe('This is a test message that is at least 10 characters long');
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt on creation', async () => {
      const message = await ContactMessage.create({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is at least 10 characters long',
      });

      expect(message.createdAt).toBeInstanceOf(Date);
    });
  });
});
