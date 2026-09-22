import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { getAllTipos, updateTipo, deleteTipo } from '$lib/repositories/tipo';
import type { Tipo } from '@prisma/client';

export const GET: RequestHandler = async ({ platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const tipos = await getAllTipos();
	if (tipos.isErr()) {
		return json({ error: 'Error al obtener los tipos.' }, { status: 500 });
	}

	return json(tipos.value);
};

export const PUT: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id, tipo } = await request.json<{ id: number; tipo: Tipo }>();

	const result = await updateTipo(id, tipo);

	if (result.isErr()) {
		return json({ error: 'Error al actualizar el tipo.' }, { status: 500 });
	}

	return json({ message: 'Tipo actualizado correctamente.' });
};

export const DELETE: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id_tipo } = await request.json<{ id_tipo: number }>();

	const result = await deleteTipo(id_tipo);

	if (result.isErr()) {
		return json({ error: 'Error al eliminar el tipo.' }, { status: 500 });
	}

	return json({ message: 'Tipo eliminado correctamente.' });
};
