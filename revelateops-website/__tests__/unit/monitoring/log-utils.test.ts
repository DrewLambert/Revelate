import {
  hashEmail,
  sanitizePhone,
  sanitizeMessage,
  createLogContext,
  measureTime,
  type LogContext,
} from '@/lib/monitoring/log-utils';

describe('Log Utils', () => {
  describe('hashEmail', () => {
    it('should return original email in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const email = 'user@example.com';
      const result = hashEmail(email);

      expect(result).toBe(email);

      process.env.NODE_ENV = originalEnv;
    });

    it('should return hashed email in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const email = 'user@example.com';
      const result = hashEmail(email);

      expect(result).not.toBe(email);
      expect(result).toHaveLength(16);
      expect(typeof result).toBe('string');

      process.env.NODE_ENV = originalEnv;
    });

    it('should produce consistent hashes for same email', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const email = 'user@example.com';
      const hash1 = hashEmail(email);
      const hash2 = hashEmail(email);

      expect(hash1).toBe(hash2);

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle email case-insensitively', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const email1 = 'User@Example.COM';
      const email2 = 'user@example.com';
      const hash1 = hashEmail(email1);
      const hash2 = hashEmail(email2);

      expect(hash1).toBe(hash2);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('sanitizePhone', () => {
    it('should mask all but last 4 digits', () => {
      const phone = '555-123-4567';
      const result = sanitizePhone(phone);

      expect(result).toContain('4567');
      expect(result).toContain('*');
      expect(result.length).toBe(phone.length);
    });

    it('should handle short phone numbers', () => {
      const phone = '123';
      const result = sanitizePhone(phone);

      expect(result).toBe('***');
    });

    it('should handle empty phone numbers', () => {
      const phone = '';
      const result = sanitizePhone(phone);

      expect(result).toBe('***');
    });

    it('should preserve last 4 characters exactly', () => {
      const phone = '1234567890';
      const result = sanitizePhone(phone);

      expect(result.slice(-4)).toBe('7890');
    });
  });

  describe('sanitizeMessage', () => {
    it('should return short messages unchanged', () => {
      const message = 'Short message';
      const result = sanitizeMessage(message);

      expect(result).toBe(message);
    });

    it('should truncate long messages', () => {
      const message = 'A'.repeat(150);
      const result = sanitizeMessage(message);

      expect(result).not.toBe(message);
      expect(result).toContain('[Message:');
      expect(result).toContain('150 chars]');
    });

    it('should respect custom maxLength', () => {
      const message = 'A'.repeat(50);
      const result = sanitizeMessage(message, 20);

      expect(result).toContain('[Message: 50 chars]');
    });

    it('should return message at exact maxLength', () => {
      const message = 'A'.repeat(100);
      const result = sanitizeMessage(message, 100);

      expect(result).toBe(message);
    });
  });

  describe('createLogContext', () => {
    it('should create basic log context with action', () => {
      const context = createLogContext({
        action: 'test_action',
      });

      expect(context.action).toBe('test_action');
    });

    it('should include conversation_id when provided', () => {
      const context = createLogContext({
        action: 'test_action',
        conversation_id: 123,
      });

      expect(context.conversation_id).toBe(123);
      expect(context.action).toBe('test_action');
    });

    it('should hash user_email in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const context = createLogContext({
        action: 'test_action',
        user_email: 'user@example.com',
      });

      expect(context.user_email).not.toBe('user@example.com');
      expect(context.user_email).toHaveLength(16);

      process.env.NODE_ENV = originalEnv;
    });

    it('should preserve user_email in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const context = createLogContext({
        action: 'test_action',
        user_email: 'user@example.com',
      });

      expect(context.user_email).toBe('user@example.com');

      process.env.NODE_ENV = originalEnv;
    });

    it('should round duration_ms to 2 decimals', () => {
      const context = createLogContext({
        action: 'test_action',
        duration_ms: 123.456789,
      });

      expect(context.duration_ms).toBe(123.46);
    });

    it('should include error object when provided', () => {
      const testError = new Error('Test error');
      const context = createLogContext({
        action: 'test_action',
        error: testError,
      });

      expect(context.error).toBe(testError);
    });

    it('should include additional custom fields', () => {
      const context = createLogContext({
        action: 'test_action',
        custom_field: 'custom_value',
        another_field: 42,
      });

      expect(context.action).toBe('test_action');
      expect(context.custom_field).toBe('custom_value');
      expect(context.another_field).toBe(42);
    });
  });

  describe('measureTime', () => {
    it('should measure execution time of async function', async () => {
      const testFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return 'result';
      };

      const { result, duration } = await measureTime(testFn);

      expect(result).toBe('result');
      expect(duration).toBeGreaterThan(90); // Allow some timing variance
      expect(duration).toBeLessThan(150);
    });

    it('should return correct result from measured function', async () => {
      const testFn = async () => {
        return { data: 'test data', count: 5 };
      };

      const { result } = await measureTime(testFn);

      expect(result).toEqual({ data: 'test data', count: 5 });
    });

    it('should measure zero duration for instant functions', async () => {
      const testFn = async () => {
        return 'instant';
      };

      const { result, duration } = await measureTime(testFn);

      expect(result).toBe('instant');
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(10); // Should be very fast
    });

    it('should propagate errors from measured function', async () => {
      const testFn = async () => {
        throw new Error('Test error');
      };

      await expect(measureTime(testFn)).rejects.toThrow('Test error');
    });
  });
});
