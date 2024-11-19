import { getDb } from './index.js';

async function checkDatabase() {
    const db = await getDb();
    try {
        console.log('Checking users table:');
        const users = await db.all('SELECT id, name, email FROM users');
        console.log(users);

        console.log('\nChecking sessions table:');
        const sessions = await db.all('SELECT * FROM sessions');
        console.log(sessions);

        await db.close();
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    checkDatabase().catch(console.error);
} 