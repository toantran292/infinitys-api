import { IsArray, IsOptional } from 'class-validator';
import { StringField } from 'src/decoractors/field.decoractors';
import { CreateAssetDto } from 'src/modules/assets/dto/create-asset.dto';

export class CreateProblemDto {
	@StringField()
	title: string;

	@StringField()
	content: string;

	@IsArray()
	@IsOptional()
	images: CreateAssetDto[];

	@IsArray()
	@IsOptional()
	testcases?: CreateAssetDto[];
}
