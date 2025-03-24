import { PartialType } from '@nestjs/swagger';
import { CreateProblemDto } from './create-problem.dto';
import { StringFieldOptional } from 'src/decoractors/field.decoractors';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAssetDto } from 'src/modules/assets/dto/create-asset.dto';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {
	@StringFieldOptional()
	title: string;

	@StringFieldOptional()
	content: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAssetDto)
	images: CreateAssetDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAssetDto)
	testcases: CreateAssetDto[];
}
