import { AbstractDto } from './common/dto/abstract.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import { PageOptionsDto } from './common/dto/page-options.dto';
import { AbstractEntity } from './common/abstract.entity';
import type { KeyOfType } from './types';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import type { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import _ from 'lodash';
import { PageDto } from './common/dto/page.dto';

declare global {
	export type Uuid = string & { _uuidBrand: undefined };

	interface Array<T> {
		toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

		toPageDto<Dto extends AbstractDto>(
			this: T[],
			pageMetaDto: PageMetaDto,
			// FIXME make option type visible from entity
			options?: unknown,
		): PageDto<Dto>;
	}
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

Array.prototype.toDtos = function <
	Entity extends AbstractEntity<Dto>,
	Dto extends AbstractDto,
>(options?: unknown): Dto[] {
	return _.compact(
		_.map<Entity, Dto>(this as Entity[], (item) =>
			item.toDto(options as never),
		),
	);
};

Array.prototype.toPageDto = function (
	pageMetaDto: PageMetaDto,
	options?: unknown,
) {
	return new PageDto(this.toDtos(options), pageMetaDto);
};

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

	const pageMetaDto = new PageMetaDto({
		itemCount,
		pageOptionsDto,
	});

	return [entities, pageMetaDto];
};
