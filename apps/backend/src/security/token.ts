import { z } from 'zod';

// Zod v4 compatible share token schema
export const shareTokenSchema = z
  .string()
  .trim()
  .min(1, 'Share token cannot be empty')
  .max(100, 'Invalid share token format');

/**
 * Validates a share token input.
 */
export function validateShareToken(token: unknown): { success: true; data: string } | { success: false; error: string } {
  const result = shareTokenSchema.safeParse(token);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Invalid share token',
    };
  }

  return {
    success: true,
    data: result.data,
  };
}