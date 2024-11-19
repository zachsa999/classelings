import { json } from '@sveltejs/kit';
import { updateCurriculum } from '$lib/db';

export async function PATCH({ params, request, locals }) {
    const curriculumId = params.id;
    const { field, value } = await request.json();
    
    try {
        await updateCurriculum(locals.db, curriculumId, { [field]: value });
        return new Response(null, { status: 204 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE({ params, locals }) {
    console.log('=== DELETE /api/curriculum/[id] START ===');
    const curriculumId = params.id;
    const db = locals.db;

    try {
        await db.run('BEGIN TRANSACTION');

        // Then delete the curriculum
        await db.run(
            'DELETE FROM curricula WHERE id = ?',
            [curriculumId]
        );

        await db.run('COMMIT');
        console.log('=== DELETE /api/curriculum/[id] END ===');
        return new Response(null, { status: 204 });
    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Delete error:', error);
        console.log('=== DELETE /api/curriculum/[id] ERROR END ===');
        return new Response(error.message, { status: 500 });
    }
} 