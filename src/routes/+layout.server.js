export const load = async ({ locals }) => {
    if (!locals.user) {
        return {
            user: null
        };
    }

    try {
        const userData = await locals.db.get(
            'SELECT id, name, email FROM users WHERE id = ?',
            [locals.user]
        );

        return {
            user: userData
        };
    } catch (error) {
        console.error('Error loading user data:', error);
        return {
            user: null
        };
    }
}; 