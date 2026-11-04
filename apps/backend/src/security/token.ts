import { z } from 'zod';

// Standard token schema: string, trimmed, non-empty, max 100 chars
export const shareTokenSchema = z
  .string({
    required_error: 'Share token is required',
    invalid_type_error: 'Share token must be a string',
  })
  .trim()
  .min(1, 'Share token cannot be empty')
  .max(100, 'Invalid share token format');

/**
 * Validates a share token input.
 * @returns { success: true, data: string } or { success: false, error: string }
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