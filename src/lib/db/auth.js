import { handleDatabaseError } from './utils.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function validateUser(db, { email, password }) {
    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            throw new Error('Invalid credentials');
        }
        return user;
    } catch (error) {
        handleDatabaseError(error, 'validateUser');
    }
}

export async function createSession(db, userId) {
    try {
        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.run(
            'INSERT INTO sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)',
            [sessionToken, userId, expiresAt.toISOString()]
        );

        return { sessionToken, expiresAt };
    } catch (error) {
        handleDatabaseError(error, 'createSession');
    }
}

export async function validateSession(db, sessionToken) {
    try {
        const session = await db.get(
            'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > ?',
            [sessionToken, new Date().toISOString()]
        );
        return session?.user_id;
    } catch (error) {
        handleDatabaseError(error, 'validateSession');
    }
} 

export async function createUser(db, { name, email, password_hash }) {
    try {
        const result = await db.run(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', 
            [name, email, password_hash]
        );
        return result.lastID;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
