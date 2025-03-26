import { IsString } from 'class-validator';
import { StringField } from 'src/decoractors/field.decoractors';

export class SubmitProblemDto {
	@StringField()
	code: string;

	@StringField()
	language: string;
}
