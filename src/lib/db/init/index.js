import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { handleDatabaseError } from '../utils.js';

let dbInstance = null;

export async function getDb() {
    if (dbInstance) return dbInstance;
    
    try {
        dbInstance = await open({
            filename: './../grading_app.db',
            driver: sqlite3.Database
        });
        return dbInstance;
    } catch (error) {
        handleDatabaseError(error, 'getDb');
    }
}

export async function closeDb() {
    if (dbInstance) {
        await dbInstance.close();
        dbInstance = null;
    }
}

// Export other modules
export * from '../curriculum.js';
export * from '../students.js';
export * from '../grades.js'; 