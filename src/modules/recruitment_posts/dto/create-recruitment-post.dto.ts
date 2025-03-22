import { StringField, UUIDField } from '../../../decoractors/field.decoractors';

export class CreateRecruitmentPostDto {
	@UUIDField()
	pageId!: Uuid;

	@StringField()
	title!: string;

	@StringField()
	jobPosition!: string;

	@StringField()
	workType!: string;

	@StringField()
	jobType!: string;

	@StringField()
	location!: string;

	@StringField({ description: 'Markdown formatted text for job description' })
	description!: string;
}
