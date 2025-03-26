import { Brackets, SelectQueryBuilder } from 'typeorm';

import { AbstractEntity } from './common/abstract.entity';
import { PageMetaDto } from './common/dto/page-meta.dto';
import { PageOptionsDto } from './common/dto/page-options.dto';

import type { KeyOfType } from './types';
import type { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

declare global {
	export type Uuid = string & { _uuidBrand: undefined };

	interface Array<T> {}
}

declare module 'typeorm' {
	interface SelectQueryBuilder<Entity> {
		searchByString(
			q: string,
			columnNames: string[],
			options?: {
				fromStart: boolean;
			},
		): this;

		paginate(
			this: SelectQueryBuilder<Entity>,
			pageOptionsDto: PageOptionsDto,
			options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
		): Promise<[Entity[], PageMetaDto]>;

		leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
			this: SelectQueryBuilder<Entity>,
			property: `${A}.${Exclude<
				KeyOfType<AliasEntity, AbstractEntity>,
				symbol
			>}`,
			alias: string,
			condition?: string,
			parameters?: ObjectLiteral,
		): this;

		leftJoin<AliasEntity extends AbstractEntity, A extends string>(
			this: SelectQueryBuilder<Entity>,
			property: `${A}.${Exclude<
				KeyOfType<AliasEntity, AbstractEntity>,
				symbol
			>}`,
			alias: string,
			condition?: string,
			parameters?: ObjectLiteral,
		): this;

		innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
			this: SelectQueryBuilder<Entity>,
			property: `${A}.${Exclude<
				KeyOfType<AliasEntity, AbstractEntity>,
				symbol
			>}`,
			alias: string,
			condition?: string,
			parameters?: ObjectLiteral,
		): this;

		innerJoin<AliasEntity extends AbstractEntity, A extends string>(
			this: SelectQueryBuilder<Entity>,
			property: `${A}.${Exclude<
				KeyOfType<AliasEntity, AbstractEntity>,
				symbol
			>}`,
			alias: string,
			condition?: string,
			parameters?: ObjectLiteral,
		): this;
	}
}

SelectQueryBuilder.prototype.searchByString = function (
	q,
	columnNames,
	options,
) {
	if (!q) {
		return this;
	}

	this.andWhere(
		new Brackets((qb) => {
			for (const item of columnNames) {
				qb.orWhere(`${item} ILIKE :q`);
			}
		}),
	);

	if (options?.fromStart) {
		this.setParameter('q', `${q}%`);
	} else {
		this.setParameter('q', `%${q}%`);
	}

	return this;
};

SelectQueryBuilder.prototype.paginate = async function (
	pageOptionsDto: PageOptionsDto,
	options?: Partial<{
		skipCount: boolean;
		takeAll: boolean;
	}>,
) {
	if (!options?.takeAll) {
		this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
	}

	const entities = await this.getMany();

	let itemCount = -1;

	if (!options?.skipCount) {
		itemCount = await this.getCount();
	}

	const pageMeta = {
		page: pageOptionsDto.page,
		take: pageOptionsDto.take,
		itemCount,
		pageCount: Math.ceil(itemCount / pageOptionsDto.take),
		hasPreviousPage: pageOptionsDto.page > 1,
		hasNextPage:
			pageOptionsDto.page < Math.ceil(itemCount / pageOptionsDto.take),
	};

	return [entities, pageMeta];
};
