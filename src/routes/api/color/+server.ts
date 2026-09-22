import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireSession } from '$lib/server/auth';
import { saveColor, updateColor } from '$lib/repositories/color';
import type { Color } from '@prisma/client';

export const POST: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { colorData }: { colorData: Color } = await request.json();
	const result = await saveColor(colorData);

	if (result.isErr()) {
		return json({ error: 'Error al crear el color.' }, { status: 500 });
	}

	return json(result.value, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, platform, cookies, locals }) => {
	const session = requireSession(platform, cookies, locals.session);
	if (session instanceof Response) return session;

	const { id, colorData } = await request.json<{ id: number; colorData: Color }>();

	const result = await updateColor(id, colorData);

	if (result.isErr()) {
		return json({ error: 'Error al actualizar el color.' }, { status: 500 });
	}

	return json(result.value);
};
