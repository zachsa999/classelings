import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDatabase() {
	console.log('Initializing database connection...');
	try {
		const db = await open({
			filename: './grading_app.db',
			driver: sqlite3.Database
		});
		console.log('Database connection established');
		return db;
	} catch (error) {
		console.error('Database initialization error:', error);
		throw error;
	}
}
