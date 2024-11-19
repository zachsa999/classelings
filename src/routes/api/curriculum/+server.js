import { json } from '@sveltejs/kit';
import { getCurricula, createCurriculum } from '$lib/db';

export async function POST({ request, locals }) {
    const { title, subject, grade_level, description } = await request.json();
    const db = locals.db;
    const teacherId = locals.user;

    try {
        const id = await createCurriculum(db, {
            title,
            subject,
            grade_level,
            description,
            teacher_id: teacherId
        });
        return json({ id });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function GET({ locals }) {
    try {
        const curricula = await getCurricula(locals.db, locals.user);
        return json(curricula);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
