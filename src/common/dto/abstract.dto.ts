import { Expose } from 'class-transformer';

import { DateField, UUIDField } from '../../decoractors/field.decoractors';
export class AbstractDto {
	@Expose()
	@UUIDField()
	id!: string;

	@Expose()
	@DateField()
	createdAt!: Date;

	@Expose()
	@DateField()
	updatedAt!: Date;
}
