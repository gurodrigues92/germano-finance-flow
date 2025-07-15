import { format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Timezone configuration for Brazil/São Paulo
 */
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Utility functions for consistent date handling with Brazil timezone
 */

/**
 * Gets the current date in Brazil timezone
 */
export const getCurrentBrazilDate = (): Date => {
  return toZonedTime(new Date(), BRAZIL_TIMEZONE);
};

/**
 * Gets the current date as a string in YYYY-MM-DD format using Brazil timezone
 */
export const getLocalDateString = (): string => {
  const brazilDate = getCurrentBrazilDate();
  return format(brazilDate, 'yyyy-MM-dd');
};

/**
 * Formats any date to Brazil timezone and returns YYYY-MM-DD format
 */
export const formatDateBrazil = (date: Date | string): string => {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Handle database date strings (YYYY-MM-DD)
    // Create date assuming it's already in Brazil timezone
    const [year, month, day] = date.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }
  
  const brazilDate = toZonedTime(dateObj, BRAZIL_TIMEZONE);
  return format(brazilDate, 'yyyy-MM-dd');
};

/**
 * Formats a date string or Date object to YYYY-MM-DD format for input fields
 * Always uses Brazil timezone to ensure consistency
 */
export const formatDateForInput = (date: string | Date): string => {
  if (!date) return getLocalDateString();
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Handle database date strings (YYYY-MM-DD)
    // Parse as if it's already in Brazil timezone
    const [year, month, day] = date.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }
  
  // Convert to Brazil timezone and format
  const brazilDate = toZonedTime(dateObj, BRAZIL_TIMEZONE);
  return format(brazilDate, 'yyyy-MM-dd');
};

/**
 * Parses a date string considering Brazil timezone
 */
export const parseDateBrazil = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  return fromZonedTime(localDate, BRAZIL_TIMEZONE);
};

/**
 * Formats a date for display in Brazilian format (DD/MM/YYYY)
 */
export const formatDateDisplay = (date: Date | string): string => {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }
  
  const brazilDate = toZonedTime(dateObj, BRAZIL_TIMEZONE);
  return format(brazilDate, 'dd/MM/yyyy');
};

/**
 * Gets current date and time formatted for Brazil timezone
 */
export const getCurrentBrazilDateTime = (): string => {
  const brazilDate = getCurrentBrazilDate();
  return format(brazilDate, 'dd/MM/yyyy HH:mm:ss');
};

/**
 * Validates if a date string is in the correct format (YYYY-MM-DD)
 */
export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return !isNaN(date.getTime()) && 
           date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  } catch {
    return false;
  }
};