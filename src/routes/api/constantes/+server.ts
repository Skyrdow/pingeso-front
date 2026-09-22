import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { getAllConstantes, saveConstantes } from '$lib/repositories/constantes';
import type { Constantes } from '@prisma/client';

export const GET: RequestHandler = async ({ platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const constantes = await getAllConstantes();

	return json({
		materiales: constantes[0],
		colores: constantes[1],
		cristales: constantes[2],
		tipos: constantes[3],
		perfiles: constantes[4],
		quincallerias: constantes[5],
		constantes_pdf: constantes[6]
	});
};

export const PUT: RequestHandler = async ({ platform, cookies, request, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const constantes: Constantes = await request.json<Constantes>();
	const result = await saveConstantes(constantes);

	if (result.isErr()) {
		return json({ error: 'Error al guardar constante.' }, { status: 500 });
	}
	return json({ message: 'Constante guardada correctamente.' });
};
