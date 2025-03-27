import { StringField } from '../../../decoractors/field.decoractors';

export class SubmitProblemDto {
	@StringField()
	code: string;

	@StringField()
	language: string;
}
