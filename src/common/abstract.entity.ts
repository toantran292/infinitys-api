import { AbstractDto } from './dto/abstract.dto';
import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { Constructor } from '../types';

export abstract class AbstractEntity<
	DTO extends AbstractDto = AbstractDto,
	O = never,
> {
	@PrimaryGeneratedColumn('uuid')
	id!: Uuid;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt!: Date;

	toDto<CDTO extends AbstractDto = DTO>(options?: O & {
		dto: Constructor<CDTO>;
	}): CDTO {
		console.log(options);
		const { dto, ...remainingOptions } = options || {};

		let dtoClass = undefined;

		if(dto)
			dtoClass = dto;
		else
			dtoClass = Object.getPrototypeOf(this).dtoClass;

		if (!dtoClass) {
			throw new Error(
				`You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
			);
		}

		return new dtoClass(this, remainingOptions);
	}
}