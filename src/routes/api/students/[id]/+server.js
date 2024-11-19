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