import { faker } from '@faker-js/faker';

/**
 * TestDataUtil - Utility class for generating test data
 * Uses Faker.js to create realistic, random test data
 * 
 * @example
 * const testData = TestDataUtil.generateUser();
 * const email = TestDataUtil.generateEmail();
 */
export class TestDataUtil {
  // ========================================
  // USER DATA GENERATION
  // ========================================

  /**
   * Generate a complete user object
   * @param options - Optional overrides for user properties
   */
  static generateUser(options?: Partial<UserData>): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      firstName: options?.firstName || firstName,
      lastName: options?.lastName || lastName,
      email: options?.email || faker.internet.email({ firstName, lastName }).toLowerCase(),
      username: options?.username || faker.internet.username({ firstName, lastName }).toLowerCase(),
      password: options?.password || this.generatePassword(),
      phone: options?.phone || faker.phone.number(),
      dateOfBirth: options?.dateOfBirth || faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      address: options?.address || this.generateAddress(),
      company: options?.company || faker.company.name(),
      jobTitle: options?.jobTitle || faker.person.jobTitle(),
    };
  }

  /**
   * Generate a strong password
   * @param length - Password length (default: 12)
   */
  static generatePassword(length: number = 12): string {
    return faker.internet.password({
      length,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/,
    });
  }

  /**
   * Generate a simple password (for testing weak passwords)
   * @param length - Password length (default: 8)
   */
  static generateWeakPassword(length: number = 8): string {
    return faker.internet.password({ length, memorable: true });
  }

  /**
   * Generate an email address
   * @param domain - Optional domain (e.g., 'test.com')
   */
  static generateEmail(domain?: string): string {
    if (domain) {
      return `${faker.internet.username()}@${domain}`.toLowerCase();
    }
    return faker.internet.email().toLowerCase();
  }

  /**
   * Generate a username
   */
  static generateUsername(): string {
    return faker.internet.username().toLowerCase();
  }

  /**
   * Generate a phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  // ========================================
  // ADDRESS GENERATION
  // ========================================

  /**
   * Generate a complete address object
   */
  static generateAddress(): AddressData {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };
  }

  // ========================================
  // COMPANY/BUSINESS DATA
  // ========================================

  /**
   * Generate company data
   */
  static generateCompany(): CompanyData {
    return {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      industry: faker.commerce.department(),
      website: faker.internet.url(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };
  }

  // ========================================
  // PRODUCT/COMMERCE DATA
  // ========================================

  /**
   * Generate product data
   */
  static generateProduct(): ProductData {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 1000 }),
    };
  }

  /**
   * Generate a price
   * @param min - Minimum price
   * @param max - Maximum price
   */
  static generatePrice(min: number = 10, max: number = 1000): number {
    return parseFloat(faker.commerce.price({ min, max }));
  }

  // ========================================
  // TEXT/CONTENT GENERATION
  // ========================================

  /**
   * Generate a sentence
   * @param wordCount - Number of words (default: 10)
   */
  static generateSentence(wordCount: number = 10): string {
    return faker.lorem.sentence(wordCount);
  }

  /**
   * Generate a paragraph
   * @param sentenceCount - Number of sentences (default: 5)
   */
  static generateParagraph(sentenceCount: number = 5): string {
    return faker.lorem.paragraph(sentenceCount);
  }

  /**
   * Generate text of specific length
   * @param length - Approximate character count
   */
  static generateText(length: number = 100): string {
    return faker.lorem.text().substring(0, length);
  }

  /**
   * Generate a title
   */
  static generateTitle(): string {
    return faker.lorem.words(3);
  }

  // ========================================
  // DATE/TIME GENERATION
  // ========================================

  /**
   * Generate a future date
   * @param days - Days from now
   */
  static generateFutureDate(days: number = 30): Date {
    return faker.date.future({ years: days / 365 });
  }

  /**
   * Generate a past date
   * @param days - Days ago
   */
  static generatePastDate(days: number = 30): Date {
    return faker.date.past({ years: days / 365 });
  }

  /**
   * Generate a recent date (within last week)
   */
  static generateRecentDate(): Date {
    return faker.date.recent({ days: 7 });
  }

  /**
   * Format date to YYYY-MM-DD
   * @param date - Date to format
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // ========================================
  // NUMBER GENERATION
  // ========================================

  /**
   * Generate a random number
   * @param min - Minimum value
   * @param max - Maximum value
   */
  static generateNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate a random float
   * @param min - Minimum value
   * @param max - Maximum value
   * @param precision - Decimal places
   */
  static generateFloat(min: number = 0, max: number = 100, precision: number = 2): number {
    return parseFloat(faker.number.float({ min, max, multipleOf: 1 / Math.pow(10, precision) }).toFixed(precision));
  }

  // ========================================
  // ARRAY/LIST GENERATION
  // ========================================

  /**
   * Generate an array of items
   * @param generator - Function to generate each item
   * @param count - Number of items
   */
  static generateArray<T>(generator: () => T, count: number = 5): T[] {
    return Array.from({ length: count }, generator);
  }

  /**
   * Generate array of users
   * @param count - Number of users
   */
  static generateUsers(count: number = 5): UserData[] {
    return this.generateArray(() => this.generateUser(), count);
  }

  /**
   * Generate array of products
   * @param count - Number of products
   */
  static generateProducts(count: number = 5): ProductData[] {
    return this.generateArray(() => this.generateProduct(), count);
  }

  // ========================================
  // SPECIAL DATA TYPES
  // ========================================

  /**
   * Generate a UUID
   */
  static generateUUID(): string {
    return faker.string.uuid();
  }

  /**
   * Generate a URL
   */
  static generateURL(): string {
    return faker.internet.url();
  }

  /**
   * Generate an image URL
   * @param width - Image width
   * @param height - Image height
   */
  static generateImageURL(width: number = 640, height: number = 480): string {
    return faker.image.url({ width, height });
  }

  /**
   * Generate a color (hex)
   */
  static generateColor(): string {
    return faker.internet.color();
  }

  /**
   * Generate a credit card number (fake, for testing only)
   */
  static generateCreditCard(): string {
    return faker.finance.creditCardNumber();
  }

  /**
   * Generate an IBAN
   */
  static generateIBAN(): string {
    return faker.finance.iban();
  }

  // ========================================
  // VALIDATION TEST DATA
  // ========================================

  /**
   * Get invalid email addresses for testing
   */
  static getInvalidEmails(): string[] {
    return [
      'invalid.email',
      '@test.com',
      'test@',
      'test @test.com',
      'test..test@test.com',
      'test@test',
    ];
  }

  /**
   * Get invalid passwords for testing
   */
  static getInvalidPasswords(): string[] {
    return [
      '', // empty
      '123', // too short
      'password', // too common
      '       ', // only spaces
    ];
  }

  /**
   * Get SQL injection strings for security testing
   */
  static getSQLInjectionStrings(): string[] {
    return [
      "' OR '1'='1",
      "'; DROP TABLE users--",
      "admin'--",
      "' OR 1=1--",
    ];
  }

  /**
   * Get XSS strings for security testing
   */
  static getXSSStrings(): string[] {
    return [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
    ];
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get a random item from an array
   * @param array - Array to pick from
   */
  static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Shuffle an array
   * @param array - Array to shuffle
   */
  static shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
}

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
  address: AddressData;
  company: string;
  jobTitle: string;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CompanyData {
  name: string;
  catchPhrase: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
  quantity: number;
}
