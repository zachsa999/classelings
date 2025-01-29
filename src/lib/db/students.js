import { handleDatabaseError } from './utils.js';

export async function getStudents(db) {
    try {
        const students = await db.all(`
            SELECT 
                s.*,
                json_group_array(
                    json_object(
                        'id', c.id,
                        'title', c.title,
                        'subject', c.subject,
                        'variant', c.variant
                    )
                ) as curricula
            FROM students s
            LEFT JOIN student_curriculum sc ON s.id = sc.student_id
            LEFT JOIN curricula c ON sc.curriculum_id = c.id
            GROUP BY s.id
            ORDER BY s.grade_level, s.name
        `);

        return students.map(student => ({
            ...student,
            curricula: JSON.parse(student.curricula).filter(c => c.id !== null)
        }));
    } catch (error) {
        handleDatabaseError(error, 'getStudents');
    }
}

export async function createStudent(db, { name, grade_level, parent_name, gender, birth_date, user_id }) {
    try {
        const result = await db.run(
            'INSERT INTO students (name, grade_level, parent_name, gender, birth_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, grade_level, parent_name, gender, birth_date, user_id]
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

export async function linkCurriculum(db, studentId, curriculumId) {
    try {
        await db.run(
            'INSERT INTO student_curriculum (student_id, curriculum_id) VALUES (?, ?)',
            [studentId, curriculumId]
        );
    } catch (error) {
        handleDatabaseError(error, 'linkCurriculum');
    }
}

export async function unlinkCurriculum(db, studentId, curriculumId) {
    try {
        await db.run(
            'DELETE FROM student_curriculum WHERE student_id = ? AND curriculum_id = ?',
            [studentId, curriculumId]
        );
    } catch (error) {
        handleDatabaseError(error, 'unlinkCurriculum');
    }
} 