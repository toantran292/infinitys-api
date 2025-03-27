import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import {
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';
import { CreateAssetDto } from '../../assets/dto/create-asset.dto';
import { ProblemDifficulty } from '../entities/problem.entity';

import { CreateProblemDto, ExampleDto } from './create-problem.dto';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {
	@StringFieldOptional()
	title: string;

	@StringFieldOptional()
	content: string;

	@EnumFieldOptional(() => ProblemDifficulty)
	difficulty: ProblemDifficulty;

	@NumberFieldOptional()
	timeLimit: number;

	@NumberFieldOptional()
	memoryLimit: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExampleDto)
	example: ExampleDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	constraints: string[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAssetDto)
	testcases: CreateAssetDto[];
}
