import { handleDatabaseError } from './utils.js';

export async function getCurricula(db, userId) {
    try {
        return await db.all(
            'SELECT * FROM curricula WHERE user_id = ? ORDER BY variant, subject',
            [userId]
        );
    } catch (error) {
        handleDatabaseError(error, 'getCurricula');
    }
}

export async function createCurriculum(db, { title, subject, variant, description, user_id }) {
    try {
        const result = await db.run(
            `INSERT INTO curricula (title, subject, variant, description, user_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [title, subject, variant, description, user_id]
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