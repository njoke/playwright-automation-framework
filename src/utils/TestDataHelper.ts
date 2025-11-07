import * as fs from 'fs';
import * as path from 'path';

/**
 * TestDataHelper provides utilities for loading and managing test data
 */
export class TestDataHelper {
  /**
   * Load test data from a JSON file
   * @param fileName - Name of the JSON file (without path)
   * @returns Parsed JSON data
   */
  static loadTestData<T>(fileName: string): T {
    const filePath = path.join(process.cwd(), 'test-data', fileName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T;
  }

  /**
   * Get valid users from test data
   * @returns Array of valid users
   */
  static getValidUsers() {
    const data = this.loadTestData<any>('users.json');
    return data.validUsers;
  }

  /**
   * Get invalid users from test data
   * @returns Array of invalid users
   */
  static getInvalidUsers() {
    const data = this.loadTestData<any>('users.json');
    return data.invalidUsers;
  }

  /**
   * Get a specific user by role
   * @param role - User role (user, admin)
   * @returns User object
   */
  static getUserByRole(role: string) {
    const users = this.getValidUsers();
    return users.find((user: any) => user.role === role);
  }

  /**
   * Get credentials from environment variables
   * @returns Object with username and password
   */
  static getCredentialsFromEnv() {
    return {
      username: process.env.TEST_USERNAME || 'testuser@qa.com',
      password: process.env.TEST_PASSWORD || 'Test@123',
    };
  }

  /**
   * Get admin credentials from environment variables
   * @returns Object with admin username and password
   */
  static getAdminCredentialsFromEnv() {
    return {
      username: process.env.ADMIN_USERNAME || 'admin@qa.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
    };
  }
}
