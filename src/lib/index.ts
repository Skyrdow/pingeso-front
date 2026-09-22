import { env } from '$env/dynamic/private';
import { jwtVerify } from 'jose';
import { err, ok } from 'neverthrow';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export const getJWTSecret = () => {
	const secret = env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET no está configurado en el entorno de ejecución');
	return new TextEncoder().encode(secret);
};

export let prisma: PrismaClient;

export const getDB = (platform: Readonly<App.Platform> | undefined) => {
	if (!platform) return err('falló la conexión con la db');
	prisma ??= new PrismaClient({ adapter: new PrismaD1(platform.env.DB) });
	return ok(prisma);
};

export const validateJWT = async (token: string) => {
	try {
		const { payload } = await jwtVerify<{ user_id: number; is_admin: number; email: string }>(
			token,
			getJWTSecret()
		);

		return ok(payload);
	} catch (error) {
		return err(error);
	}
};
