import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested, IsString } from 'class-validator';

import {
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';
import { CreateAssetDto } from '../../assets/dto/create-asset.dto';
import { ProblemDifficulty } from '../entities/problem.entity';

export class ExampleDto {
	@StringField()
	input: string;

	@StringField()
	output: string;

	@StringFieldOptional()
	explanation: string;
}

export class CreateProblemDto {
	@StringField()
	title: string;

	@StringField()
	content: string;

	@EnumField(() => ProblemDifficulty)
	difficulty: ProblemDifficulty;

	@NumberField()
	timeLimit: number;

	@NumberField()
	memoryLimit: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExampleDto)
	examples: ExampleDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	constraints: string[];

	@IsArray()
	@IsOptional()
	testcases?: CreateAssetDto[];
}
