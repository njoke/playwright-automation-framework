/**
 * DateTimeHelper provides utilities for date and time operations
 */
export class DateTimeHelper {
  /**
   * Get current date in YYYY-MM-DD format
   * @returns Current date string
   */
  static getCurrentDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /**
   * Get current timestamp
   * @returns Current timestamp in milliseconds
   */
  static getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * Get current date-time in ISO format
   * @returns Current date-time string
   */
  static getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  /**
   * Format date to specific format
   * @param date - Date object
   * @param format - Format string (default: 'YYYY-MM-DD')
   * @returns Formatted date string
   */
  static formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Add days to a date
   * @param date - Base date
   * @param days - Number of days to add
   * @returns New date with added days
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Subtract days from a date
   * @param date - Base date
   * @param days - Number of days to subtract
   * @returns New date with subtracted days
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /**
   * Get date range for testing
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Object with formatted start and end dates
   */
  static getDateRange(startDate: Date, endDate: Date) {
    return {
      start: this.formatDate(startDate),
      end: this.formatDate(endDate),
    };
  }

  /**
   * Generate a unique timestamp-based string
   * @returns Unique string based on timestamp
   */
  static generateUniqueString(): string {
    return `test_${this.getCurrentTimestamp()}`;
  }
}
