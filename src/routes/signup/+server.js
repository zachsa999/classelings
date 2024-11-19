import { AuthService } from '$lib/auth/service';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const { name, email, password } = await request.json();

	if (!name || !email || !password) {
		throw error(400, 'Username, email, and password are required.');
	}

	const authService = new AuthService(locals.db);

	try {
		await authService.createUser(name, email, password);
		return json({ message: 'User registered successfully' });
	} catch (err) {
		throw error(400, err.message);
	}
}
