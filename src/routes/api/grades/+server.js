import { json } from '@sveltejs/kit';
import { getGrades, createGrade } from '$lib/db';

export async function POST({ request, locals }) {
    const { student_id, curriculum_id, score, comment } = await request.json();
    
    try {
        const id = await createGrade(locals.db, {
            student_id,
            curriculum_id,
            score,
            comment
        });
        return json({ id });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function GET({ url, locals }) {
    const student_id = url.searchParams.get('student_id');
    const curriculum_id = url.searchParams.get('curriculum_id');
    
    try {
        const grades = await getGrades(locals.db, { student_id, curriculum_id });
        return json(grades);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
} 