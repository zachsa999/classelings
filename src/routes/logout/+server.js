import { AuthService } from '$lib/auth/service.js';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {
	try {
		const sessionToken = cookies.get('session');
		if (sessionToken) {
			const authService = new AuthService(locals.db);
			await authService.deleteSession(sessionToken);
			
			cookies.delete('session', { 
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});
		}
		
		return json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return new Response('Logout failed', { status: 500 });
	}
}
