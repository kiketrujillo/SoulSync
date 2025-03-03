// src/utils/encrypt.ts
import crypto from 'crypto';

// Get encryption key from environment variables or use a default (for development only)
const encryptionKey = process.env.ENCRYPTION_KEY || '32-character-secure-key-for-aes256';

// Algorithm to use
const algorithm = 'aes-256-cbc';

/**
 * Encrypt text using AES-256-CBC
 * @param text - The text to encrypt
 * @returns The encrypted text with IV prepended, formatted as hex
 */
export const encrypt = (text: string): string => {
  try {
    // Create a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher with key and iv
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV (as hex) to the encrypted data
    // Format: <iv-hex>:<encrypted-hex>
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text that was encrypted with the encrypt function
 * @param encryptedText - The encrypted text with IV prepended
 * @returns The decrypted (original) text
 */
export const decrypt = (encryptedText: string): string => {
  try {
    // Split the IV and encrypted data
    const [ivHex, encryptedHex] = encryptedText.split(':');
    
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted format');
    }
    
    // Convert hex strings back to buffers
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create decipher with key and iv
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash a text using SHA-256 (for situations where one-way hashing is needed)
 * @param text - The text to hash
 * @returns The hashed text
 */
export const hash = (text: string): string => {
  try {
    return crypto.createHash('sha256').update(text).digest('hex');
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
};

/**
 * Generate a secure random token
 * @param length - Length of the token in bytes (default: 32)
 * @returns A random token as a hex string
 */
export const generateToken = (length: number = 32): string => {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};
