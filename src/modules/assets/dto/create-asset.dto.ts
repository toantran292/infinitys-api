import { NumberField } from 'src/decoractors/field.decoractors';
import { StringField } from 'src/decoractors/field.decoractors';

export class CreateAssetDto {
	@StringField()
	key!: string;

	@NumberField()
	readonly size!: number;

	@StringField()
	readonly name!: string;

	@StringField()
	readonly content_type!: string;
}
