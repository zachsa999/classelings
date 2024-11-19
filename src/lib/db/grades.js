import { handleDatabaseError, executeTransaction } from './utils.js';

export async function getGrades(db, { student_id, curriculum_id }) {
    try {
        let query = `
            SELECT g.*, s.name as student_name, c.title as curriculum_title
            FROM grades g
            JOIN students s ON g.student_id = s.id
            JOIN curricula c ON g.curriculum_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (student_id) {
            query += ' AND g.student_id = ?';
            params.push(student_id);
        }
        if (curriculum_id) {
            query += ' AND g.curriculum_id = ?';
            params.push(curriculum_id);
        }

        return await db.all(query, params);
    } catch (error) {
        handleDatabaseError(error, 'getGrades');
    }
}

export async function createGrade(db, { student_id, curriculum_id, score, comment }) {
    try {
        const result = await db.run(
            'INSERT INTO grades (student_id, curriculum_id, score, comment) VALUES (?, ?, ?, ?)',
            [student_id, curriculum_id, score, comment]
        );
        return result.lastID;
    } catch (error) {
        handleDatabaseError(error, 'createGrade');
    }
} 