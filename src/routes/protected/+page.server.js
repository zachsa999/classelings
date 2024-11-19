import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const userData = await locals.db.get(
        'SELECT id, name, email FROM users WHERE id = ?', 
        [locals.user]
    );

    return {
        user: userData
    };
};