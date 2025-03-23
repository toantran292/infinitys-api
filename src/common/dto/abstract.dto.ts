import { DateField, UUIDField } from '../../decoractors/field.decoractors';
import { Expose } from 'class-transformer';
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
