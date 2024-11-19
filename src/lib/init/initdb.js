import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const tableSchemas = {
    users: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,
    sessions: `
        CREATE TABLE IF NOT EXISTS sessions (
            session_token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `,
    curricula: `
        CREATE TABLE IF NOT EXISTS curricula (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            grade_level INTEGER NOT NULL CHECK(grade_level BETWEEN 1 AND 12),
            description TEXT,
            teacher_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES users (id)
        )
    `,
    students: `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            grade_level INTEGER NOT NULL CHECK(grade_level BETWEEN 1 AND 12),
            parent_name TEXT,
            gender TEXT CHECK(gender IN ('male', 'female', 'other')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,
    grades: `
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            curriculum_id INTEGER NOT NULL,
            score INTEGER CHECK(score >= 0 AND score <= 100),
            comment TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (curriculum_id) REFERENCES curricula (id)
        )
    `
};

async function initDatabase() {
    const db = await open({
        filename: './grading_app.db',
        driver: sqlite3.Database
    });

    try {
        await db.run('BEGIN TRANSACTION');

        // Drop all existing tables in reverse order (due to foreign key constraints)
        console.log('Dropping existing tables...');
        const dropTables = [
            'grades',
            'students',
            'curricula',
            'sessions',
            'users'
        ];

        for (const table of dropTables) {
            await db.run(`DROP TABLE IF EXISTS ${table}`);
            console.log(`Dropped table: ${table}`);
        }

        // Create tables in correct order
        console.log('Creating new tables...');
        for (const [tableName, schema] of Object.entries(tableSchemas)) {
            // Remove "IF NOT EXISTS" since we're always creating new tables
            const cleanSchema = schema.replace('IF NOT EXISTS', '');
            await db.run(cleanSchema);
            console.log(`Created table: ${tableName}`);
        }

        await db.run('COMMIT');
        console.log('Database schema updated successfully');
    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Error updating database schema:', error);
        throw error;
    } finally {
        await db.close();
    }
}

// Run the initialization if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    initDatabase().catch(console.error);
}

export default initDatabase;
