import { json } from '@sveltejs/kit';

export async function PATCH({ params, request, locals }) {
    const studentId = params.id;
    const { field, value } = await request.json();
    const db = locals.db;

    try {
        await db.run(
            `UPDATE students 
             SET ${field} = ?
             WHERE id = ?`,
            [value, studentId]
        );

        console.log(`Updated student ${studentId} field ${field} to ${value}`);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error updating student:', error);
        return new Response(error.message, { status: 500 });
    }
}

export async function DELETE({ params, locals }) {
    const studentId = params.id;
    const db = locals.db;

    try {
        await db.run('BEGIN TRANSACTION');

        // Delete from student_curriculum first (though CASCADE should handle this)
        await db.run(
            'DELETE FROM student_curriculum WHERE student_id = ?',
            [studentId]
        );

        // Delete related grades
        await db.run(
            'DELETE FROM grades WHERE student_id = ?',
            [studentId]
        );

        // Then delete the student
        await db.run(
            'DELETE FROM students WHERE id = ?',
            [studentId]
        );

        await db.run('COMMIT');
        return new Response(null, { status: 204 });
    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Delete error:', error);
        return new Response(error.message, { status: 500 });
    }
} 