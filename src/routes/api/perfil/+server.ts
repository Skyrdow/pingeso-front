import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { getAllPerfiles, savePerfil, updatePerfil, deletePerfil } from '$lib/repositories/perfil';
import type { Perfil } from '@prisma/client';

// GET - Obtener todos los perfiles
export const GET: RequestHandler = async ({ platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const perfiles = await getAllPerfiles();
	if (perfiles.isErr()) {
		return json({ error: 'Error al obtener los perfiles.' }, { status: 500 });
	}

	return json(perfiles.value);
};

// POST - Crear nuevo perfil
export const POST: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { perfilData }: { perfilData: Perfil } = await request.json();
	const result = await savePerfil(perfilData);

	if (result.isErr()) {
		return json({ error: 'Error al crear el perfil.' }, { status: 500 });
	}

	return json(result.value, { status: 201 });
};

// PUT - Actualizar perfil existente
export const PUT: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id, perfilData } = await request.json<{ id: number; perfilData: Perfil }>();

	const result = await updatePerfil(id, perfilData);

	if (result.isErr()) {
		return json({ error: 'Error al actualizar el perfil.' }, { status: 500 });
	}

	return json({ message: 'Perfil actualizado correctamente.' });
};

// DELETE - Eliminar perfil
export const DELETE: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id_perfil } = await request.json<{ id_perfil: number }>();

	const result = await deletePerfil(id_perfil);

	if (result.isErr()) {
		return json({ error: 'Error al eliminar el perfil.' }, { status: 500 });
	}

	return json({ message: 'Perfil eliminado correctamente.' });
};
