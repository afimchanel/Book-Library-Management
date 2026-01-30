import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Setup dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Date Utilities
 * ใช้ dayjs เป็นหลักในการจัดการ date/time ทั้งระบบ
 */

/**
 * Format date to readable string
 */
export const formatDate = (
  dateString: string | Date,
  format: string = 'MMM D, YYYY'
): string => {
  return dayjs(dateString).format(format);
};

/**
 * Format date with locale support
 */
export const formatDateLocale = (
  dateString: string | Date,
  locale: string = 'en'
): string => {
  return dayjs(dateString).locale(locale).format('LL');
};

/**
 * Check if date is overdue (past today)
 */
export const isOverdue = (dueDate: string | Date): boolean => {
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Get days remaining until due date
 * Returns negative number if overdue
 */
export const getDaysRemaining = (dueDate: string | Date): number => {
  return dayjs(dueDate).diff(dayjs(), 'day');
};

/**
 * Get human-readable relative time
 * e.g., "2 days ago", "in 3 days"
 */
export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Get time ago from now
 * e.g., "2 hours ago", "3 days ago"
 */
export const getTimeAgo = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Add days to a date
 */
export const addDays = (date: string | Date, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: string | Date, days: number): Date => {
  return dayjs(date).subtract(days, 'day').toDate();
};

/**
 * Check if date is between two dates
 */
export const isBetween = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const d = dayjs(date);
  return d.isAfter(dayjs(startDate)) && d.isBefore(dayjs(endDate));
};

/**
 * Get start of day
 */
export const startOfDay = (date: string | Date): Date => {
  return dayjs(date).startOf('day').toDate();
};

/**
 * Get end of day
 */
export const endOfDay = (date: string | Date): Date => {
  return dayjs(date).endOf('day').toDate();
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString: string): Date => {
  return dayjs(dateString).toDate();
};

/**
 * Check if date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  return dayjs(dateString).isValid();
};
