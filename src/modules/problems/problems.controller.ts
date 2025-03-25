import {
	Controller,
	Get,
	Param,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { PaginatedProblemsResponseDto } from './dto/list-problems-response.dto';
import { ProblemResponseDto } from './dto/problem-response.dto';
import { UUIDParam } from 'src/decoractors/http.decorators';
@Controller('api/problems')
export class ProblemsController {
	constructor(private readonly problemsService: ProblemsService) {}

	@SerializeOptions({
		type: PaginatedProblemsResponseDto,
	})
	@Get()
	async getProblems(@Query() pageOptionsDto: ProblemPageOptionDto) {
		return this.problemsService.getProblems(pageOptionsDto, false);
	}

	@SerializeOptions({
		type: ProblemResponseDto,
	})
	@Get(':id')
	async getProblem(@UUIDParam('id') id: Uuid) {
		return this.problemsService.getProblem(id, true);
	}
}
