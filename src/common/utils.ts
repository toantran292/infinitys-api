import * as bcrypt from 'bcrypt';
import { getMetadataArgsStorage } from 'typeorm';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
	return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
	password: string | undefined,
	hash: string | undefined | null,
): Promise<boolean> {
	if (!password || !hash) {
		return Promise.resolve(false);
	}

	return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
	getVar: () => TResult,
): string | undefined {
	const m = /\(\)=>(.*)/.exec(
		getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
	);

	if (!m) {
		throw new Error(
			"The function does not contain a statement matching 'return variableName;'",
		);
	}

	const fullMemberName = m[1]!;

	const memberParts = fullMemberName.split('.');

	return memberParts.at(-1);
}

export function getEntityTypeFromInstance(entity: object): string {
	const target = entity.constructor;

	const entityMeta = getMetadataArgsStorage().tables.find(
		(table) => table.target === target,
	);

	if (!entityMeta) {
		throw new Error(`Entity metadata not found for ${target.name}`);
	}

	return entityMeta.name ?? target.name;
}
