import { describe, it, expect, beforeEach } from '@jest/globals';
import Project from '../Project.js';

describe('Project Model', () => {
  beforeEach(async () => {
    await Project.deleteMany({});
  });

  describe('Happy Path', () => {
    it('should create a new project with valid data', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'This is a test project description that is at least 10 characters',
        category: 'Frontend',
        tags: ['React', 'Node.js'],
        featured: true,
      };

      const project = await Project.create(projectData);

      expect(project).toBeDefined();
      expect(project.title).toBe(projectData.title);
      expect(project.description).toBe(projectData.description);
      expect(project.category).toBe('Frontend');
      expect(project.featured).toBe(true);
      expect(project.tags).toHaveLength(2);
    });

    it('should default category to "Other"', async () => {
      const project = await Project.create({
        title: 'Default Category Project',
        description: 'This is a test project description that is at least 10 characters',
      });

      expect(project.category).toBe('Other');
    });

    it('should default featured to false', async () => {
      const project = await Project.create({
        title: 'Non-featured Project',
        description: 'This is a test project description that is at least 10 characters',
      });

      expect(project.featured).toBe(false);
    });

    it('should create project without optional fields', async () => {
      const project = await Project.create({
        title: 'Minimal Project',
        description: 'This is a test project description that is at least 10 characters',
      });

      expect(project.imageUrl).toBeUndefined();
      expect(project.projectUrl).toBeUndefined();
      expect(project.tags).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    it('should require title', async () => {
      await expect(
        Project.create({
          description: 'This is a test project description that is at least 10 characters',
        })
      ).rejects.toThrow(/Title is required/);
    });

    it('should require description', async () => {
      await expect(
        Project.create({ title: 'Test Project' })
      ).rejects.toThrow(/Description is required/);
    });

    it('should enforce minimum title length (3 characters)', async () => {
      await expect(
        Project.create({
          title: 'ab',
          description: 'This is a test project description that is at least 10 characters',
        })
      ).rejects.toThrow(/at least 3 characters/);
    });

    it('should enforce maximum title length (100 characters)', async () => {
      await expect(
        Project.create({
          title: 'a'.repeat(101),
          description: 'This is a test project description that is at least 10 characters',
        })
      ).rejects.toThrow(/cannot exceed 100 characters/);
    });

    it('should enforce minimum description length (10 characters)', async () => {
      await expect(
        Project.create({
          title: 'Test Project',
          description: 'Short',
        })
      ).rejects.toThrow(/at least 10 characters/);
    });

    it('should enforce maximum description length (500 characters)', async () => {
      await expect(
        Project.create({
          title: 'Test Project',
          description: 'a'.repeat(501),
        })
      ).rejects.toThrow(/cannot exceed 500 characters/);
    });

    it('should validate category enum', async () => {
      await expect(
        Project.create({
          title: 'Test Project',
          description: 'This is a test project description that is at least 10 characters',
          category: 'InvalidCategory',
        })
      ).rejects.toThrow(/validation failed/);
    });

    it('should accept all valid categories', async () => {
      const categories = ['Frontend', 'Backend', 'MERN', 'APIs', 'Experiments', 'Other'];

      for (const category of categories) {
        const project = await Project.create({
          title: `${category} Project`,
          description: 'This is a test project description that is at least 10 characters',
          category,
        });

        expect(project.category).toBe(category);
      }
    });
  });

  describe('Data Processing', () => {
    it('should trim whitespace from title', async () => {
      const project = await Project.create({
        title: '  Trimmed Title  ',
        description: 'This is a test project description that is at least 10 characters',
      });

      expect(project.title).toBe('Trimmed Title');
    });

    it('should trim whitespace from description', async () => {
      const project = await Project.create({
        title: 'Test Project',
        description: '  Trimmed description that is at least 10 characters  ',
      });

      expect(project.description).toBe('Trimmed description that is at least 10 characters');
    });

    it('should trim tags', async () => {
      const project = await Project.create({
        title: 'Test Project',
        description: 'This is a test project description that is at least 10 characters',
        tags: ['  React  ', '  Node.js  '],
      });

      expect(project.tags).toEqual(['React', 'Node.js']);
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt on creation', async () => {
      const project = await Project.create({
        title: 'Timestamp Project',
        description: 'This is a test project description that is at least 10 characters',
      });

      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });
  });
});
