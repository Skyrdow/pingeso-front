import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { deletePresupuesto, editarEstado, savePresupuesto } from '$lib/repositories/presupuesto';
import { getAllPresupuestos } from '$lib/repositories/presupuesto';
import type { PresupuestoModel } from '$lib/types';

export const GET: RequestHandler = async ({ platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const presupuestosResult = await getAllPresupuestos();

	if (presupuestosResult.isErr()) {
		return json({ error: presupuestosResult.error }, { status: 500 });
	}

	return json(presupuestosResult.value);
};

export const POST: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const presupuesto = await request.json<PresupuestoModel>();

	const id_usuario = session.user_id;
	const saveResult = await savePresupuesto(presupuesto, id_usuario);

	if (saveResult.isErr()) {
		return json({ error: saveResult.error.message }, { status: 500 });
	}

	return json({ message: 'Presupuesto guardado correctamente', presupuesto: saveResult.value });
};

export const PUT: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const presupuesto = await request.json<PresupuestoModel>();

	// Validar que el presupuesto tenga un ID válido
	if (!presupuesto.id_presupuesto) {
		return json({ error: 'ID de presupuesto no proporcionado.' }, { status: 400 });
	}

	// Podría usarse si es que se quiere reasignar el id a un presupuesto
	//const id_usuario = validationResult.value.user_id;
	const updateResult = await editarEstado(presupuesto.id_presupuesto, presupuesto.estado);

	if (updateResult.isErr()) {
		return json({ error: updateResult.error }, { status: 500 });
	}

	return json({
		message: 'Presupuesto actualizado correctamente',
		presupuesto: updateResult.value
	});
};

export const DELETE: RequestHandler = async ({ platform, cookies, request, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id } = await request.json<{ id: number }>();

	const resp = await deletePresupuesto(id);

	return json({ resp });
};
