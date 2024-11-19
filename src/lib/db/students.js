import { handleDatabaseError, executeTransaction } from './utils.js';

export async function getStudents(db) {
    try {
        return await db.all(`
            SELECT s.* 
            FROM students s
            ORDER BY s.grade_level, s.name
        `);
    } catch (error) {
        handleDatabaseError(error, 'getStudents');
    }
}

export async function createStudent(db, { name, grade_level, parent_name, gender }) {
    try {
        const result = await db.run(
            'INSERT INTO students (name, grade_level, parent_name, gender) VALUES (?, ?, ?, ?)',
            [name, grade_level, parent_name, gender]
        );
        return result.lastID;
    } catch (error) {
        handleDatabaseError(error, 'createStudent');
    }
}

export async function updateStudent(db, id, updates) {
    try {
        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(updates), id];

        await db.run(
            `UPDATE students SET ${setClause} WHERE id = ?`,
            values
        );
    } catch (error) {
        handleDatabaseError(error, 'updateStudent');
    }
} 