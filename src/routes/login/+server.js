import { AuthService } from '$lib/auth/service';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals, cookies }) {
    console.log('POST /login');
    const { email, password } = await request.json();
    const authService = new AuthService(locals.db);
    
    try {
        const { user, sessionToken, expiresAt } = await authService.validateUser(email, password);
        
        cookies.set('session', sessionToken, {
            path: '/',
            expires: new Date(expiresAt),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        return json({ error: error.message || 'Invalid credentials' }, { status: 401 });
    }
}

export const GET = async () => {
    return json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}; 