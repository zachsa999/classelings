import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class AuthService {
    constructor(db) {
        this.db = db;
    }

    async validateUser(email, password) {
        console.log('Attempting login for email:', email);
        const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Found user:', user);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', passwordMatch);
        
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await this.db.run(
            'INSERT INTO sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)',
            [sessionToken, user.id, expiresAt.toISOString()]
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            sessionToken,
            expiresAt
        };
    }

    async validateSession(sessionToken) {
        const session = await this.db.get(
            'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > ?',
            [sessionToken, new Date().toISOString()]
        );
        return session?.user_id;
    }

    async deleteSession(sessionToken) {
        await this.db.run('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);
    }
} 