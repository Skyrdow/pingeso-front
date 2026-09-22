import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { requireSession } from '$lib/server/auth';
import { saveUsuario } from '$lib/repositories/usuarios';

import type { RequestHandler } from './$types';
import type { Usuario } from '@prisma/client';

export const POST: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const userToRegister = await request.json<Usuario>();

	// Hashea la contraseña antes de guardarla
	const hashedPassword = await bcrypt.hash(userToRegister.password, 10);

	// Crea el nuevo usuario en la base de datos
	const saveResult = await saveUsuario(userToRegister, hashedPassword);

	if (saveResult.isErr()) return json({ error: saveResult.error.message }, { status: 400 });

	// Devuelve una respuesta de éxito
	return json({ message: 'Usuario registrado con éxito' });
};
