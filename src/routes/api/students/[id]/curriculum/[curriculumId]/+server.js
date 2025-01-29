import { json } from '@sveltejs/kit';
import { linkCurriculum, unlinkCurriculum } from '$lib/db';

export async function POST({ params, locals }) {
    const { id: studentId, curriculumId } = params;
    const db = locals.db;

    try {
        await linkCurriculum(db, studentId, curriculumId);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error linking curriculum:', error);
        return json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE({ params, locals }) {
    const { id: studentId, curriculumId } = params;
    const db = locals.db;

    try {
        await unlinkCurriculum(db, studentId, curriculumId);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error unlinking curriculum:', error);
        return json({ error: error.message }, { status: 500 });
    }
} 