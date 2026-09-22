import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { deleteMaterial, updateMaterial } from '$lib/repositories/material';
import type { Material } from '@prisma/client';

export const DELETE: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id_material } = await request.json<{ id_material: number }>();

	const result = await deleteMaterial(id_material);

	if (result.isErr()) {
		return json({ error: 'Error al eliminar el material.' }, { status: 500 });
	}

	return json({ message: 'Material eliminado correctamente.' });
};

export const PUT: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id, materialData } = await request.json<{ id: number; materialData: Material }>();

	const result = await updateMaterial(id, materialData);

	if (result.isErr()) {
		return json({ error: 'Error al actualizar el material.' }, { status: 500 });
	}

	return json({ message: 'Material actualizado correctamente.' });
};
