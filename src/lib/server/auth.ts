import { json, type Cookies } from '@sveltejs/kit';
import { getDB } from '$lib';

export function requireSession(
	platform: Readonly<App.Platform> | undefined,
	cookies: Cookies,
	session: App.Locals['session']
) {
	const connection = getDB(platform);
	if (connection.isErr()) return json({ error: connection.error }, { status: 400 });
	if (!cookies.get('authToken')) return json({ error: 'Token no proporcionado.' }, { status: 401 });
	if (!session) return json({ error: 'Token inválido.' }, { status: 401 });
	return session;
}
