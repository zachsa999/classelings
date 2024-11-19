import { handleDatabaseError, executeTransaction } from './utils.js';

export async function getCurricula(db, teacherId) {
    try {
        return await db.all(
            'SELECT * FROM curricula WHERE teacher_id = ? ORDER BY grade_level, subject',
            [teacherId]
        );
    } catch (error) {
        handleDatabaseError(error, 'getCurricula');
    }
}

export async function createCurriculum(db, { title, subject, grade_level, description, teacher_id }) {
    try {
        const result = await db.run(
            `INSERT INTO curricula (title, subject, grade_level, description, teacher_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [title, subject, grade_level, description, teacher_id]
        );
        return result.lastID;
    } catch (error) {
        handleDatabaseError(error, 'createCurriculum');
    }
}

export async function updateCurriculum(db, id, updates) {
    try {
        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(updates), id];

        await db.run(
            `UPDATE curricula SET ${setClause} WHERE id = ?`,
            values
        );
    } catch (error) {
        handleDatabaseError(error, 'updateCurriculum');
    }
} 