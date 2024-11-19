import { getDb } from '$lib/db/index.js';
import { AuthService } from '$lib/auth/service';

export async function handle({ event, resolve }) {
	const db = await getDb();
	event.locals.db = db;

	const sessionToken = event.cookies.get('session');
	if (sessionToken) {
		try {
			const authService = new AuthService(db);
			const userId = await authService.validateSession(sessionToken);
			if (userId) {
				event.locals.user = userId;
			}
		} catch (error) {
			event.cookies.delete('session');
		}
	}

	const response = await resolve(event);
	return response;
}
