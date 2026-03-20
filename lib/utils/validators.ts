// Validation Schemas

import { z } from 'zod';

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be 8+ characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[!@#$%^&*]/, 'Must contain special character'),
  firstName: z.string().min(2, 'First name required').max(100),
  lastName: z.string().min(2, 'Last name required').max(100),
  charityId: z.string().uuid('Invalid charity ID'),
  charityContributionPercent: z
    .number()
    .min(10, 'Minimum 10% contribution')
    .max(100, 'Cannot exceed 100%'),
  plan: z.enum(['monthly', 'yearly']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
});

// Score Schema
export const scoreSchema = z.object({
  score_value: z
    .number()
    .int('Score must be whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  score_date: z.string(),
  course_name: z.string().optional(),
});

// Charity Contribution Schema
export const charityUpdateSchema = z.object({
  selectedCharityId: z.string().uuid('Invalid charity ID'),
  charityContributionPercentage: z
    .number()
    .min(10, 'Minimum 10% contribution')
    .max(100, 'Cannot exceed 100%'),
});

// Admin Schemas
export const drawConfigSchema = z.object({
  drawMode: z.enum(['random', 'algorithmic']),
  drawMonth: z.string().date('Invalid date'),
});

export const charityManagementSchema = z.object({
  name: z.string().min(2, 'Name required').max(255),
  description: z.string().optional(),
  category: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL').optional(),
});

export const winnerVerificationSchema = z.object({
  winnerId: z.string().uuid('Invalid winner ID'),
  approved: z.boolean(),
  rejectionReason: z.string().optional(),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ScoreInput = z.infer<typeof scoreSchema>;
export type CharityUpdateInput = z.infer<typeof charityUpdateSchema>;
export type DrawConfigInput = z.infer<typeof drawConfigSchema>;
export type WinnerVerificationInput = z.infer<typeof winnerVerificationSchema>;
