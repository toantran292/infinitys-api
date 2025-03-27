import {
	NumberField,
	StringField,
} from '../../../decoractors/field.decoractors';

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
