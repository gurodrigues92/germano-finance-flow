/**
 * Utility functions for consistent date handling
 */

/**
 * Gets the current date as a string in YYYY-MM-DD format using local timezone
 */
export const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date string or Date object to YYYY-MM-DD format for input fields
 * Handles both database date strings and Date objects consistently
 */
export const formatDateForInput = (date: string | Date): string => {
  if (!date) return getLocalDateString();
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Handle database date strings (YYYY-MM-DD)
    // Create date using local timezone to avoid timezone shift
    const [year, month, day] = date.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Validates if a date string is in the correct format (YYYY-MM-DD)
 */
export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString + 'T00:00:00');
  return !isNaN(date.getTime());
};