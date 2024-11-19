import { json } from '@sveltejs/kit';
import { getStudents, createStudent } from '$lib/db';

export async function POST({ request, locals }) {
    const { name, grade_level, parent_name, gender } = await request.json();
    
    try {
        const id = await createStudent(locals.db, {
            name,
            grade_level,
            parent_name,
            gender
        });
        
        return json({ 
            id,
            name, 
            grade_level,
            parent_name,
            gender
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function GET({ locals }) {
    try {
        const students = await getStudents(locals.db);
        return json(students);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
} 