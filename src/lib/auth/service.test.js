import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './service';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService;
    let mockDb;

    beforeEach(() => {
        mockDb = {
            get: vi.fn(),
            run: vi.fn()
        };
        authService = new AuthService(mockDb);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('validateUser', () => {
        it('should successfully validate user with correct credentials', async () => {
            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: await bcrypt.hash('password123', 10)
            };

            mockDb.get.mockResolvedValue(mockUser);
            mockDb.run.mockResolvedValue({});

            const result = await authService.validateUser('test@example.com', 'password123');

            expect(result.user).toEqual({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email
            });
            expect(result.sessionToken).toBeDefined();
            expect(result.expiresAt).toBeDefined();
        });

        it('should throw error for invalid credentials', async () => {
            mockDb.get.mockResolvedValue(null);

            await expect(
                authService.validateUser('wrong@example.com', 'wrongpass')
            ).rejects.toThrow('Invalid credentials');
        });
    });
}); 