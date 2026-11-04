/**
 * Checks whether an expiration date has passed relative to a reference time.
 * @param expiresAt The target expiration timestamp.
 * @param referenceTime The time to compare against (defaults to current time).
 * @returns true if current time is equal to or past expiration time.
 */
export function isExpired(expiresAt: Date | string | number, referenceTime: Date = new Date()): boolean {
  const expiryDate = new Date(expiresAt);
  
  if (isNaN(expiryDate.getTime())) {
    throw new Error('Invalid expiration date provided');
  }

  return referenceTime.getTime() >= expiryDate.getTime();
}