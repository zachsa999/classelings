import { getDb } from './index.js';
import { tableSchemas } from './schema.js';

export async function initDatabase() {
    const db = await getDb();

    try {
        await db.run('BEGIN TRANSACTION');

        // Reference to initdb.js for schema
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

        console.log('Creating new tables...');
        for (const [tableName, schema] of Object.entries(tableSchemas)) {
            await db.run(schema);
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

if (process.argv[1] === new URL(import.meta.url).pathname) {
    initDatabase().catch(console.error);
} 