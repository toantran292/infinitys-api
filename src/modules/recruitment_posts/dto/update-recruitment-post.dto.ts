import {
	StringFieldOptional,
	DateFieldOptional,
	BooleanFieldOptional,
} from '../../../decoractors/field.decoractors';

export class UpdateRecruitmentPostDto {
	@DateFieldOptional()
	endDate?: Date;

	@BooleanFieldOptional()
	active?: boolean;

	@StringFieldOptional()
	title?: string;

	@StringFieldOptional()
	jobPosition?: string;

	@StringFieldOptional()
	location?: string;

	@StringFieldOptional()
	workMode?: string;

	@StringFieldOptional({
		description: 'Markdown formatted text for job description',
	})
	description?: string;

	@DateFieldOptional()
	problemStartDate?: Date;

	@DateFieldOptional()
	problemEndDate?: Date;
}
