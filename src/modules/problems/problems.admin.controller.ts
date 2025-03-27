import {
	Controller,
	Post,
	Body,
	Get,
	SerializeOptions,
	Query,
	Patch,
	Delete,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';

import { CreateProblemDto } from './dto/create-problem.dto';
import { DeleteTestcaseDto } from './dto/delete-testcase.dto';
import { AdminPaginatedProblemsResponseDto } from './dto/list-problems-response.dto';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { AdminProblemResponseDto } from './dto/problem-response.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ProblemsService } from './problems.service';

@Controller('admin_api/problems')
export class ProblemsAdminController {
	constructor(private readonly problemsService: ProblemsService) {}

	@SerializeOptions({
		type: AdminProblemResponseDto,
	})
	@Post()
	@Auth([RoleType.ADMIN])
	async createProblem(@Body() createProblemDto: CreateProblemDto) {
		return this.problemsService.createProblem(createProblemDto);
	}

	@SerializeOptions({
		type: AdminPaginatedProblemsResponseDto,
	})
	@Get()
	async getProblems(@Query() pageOptionsDto: ProblemPageOptionDto) {
		const result = await this.problemsService.getProblems(pageOptionsDto);
		return result;
	}

	@SerializeOptions({
		type: AdminProblemResponseDto,
	})
	@Get(':id')
	async getProblem(@UUIDParam('id') id: Uuid) {
		return this.problemsService.getProblem(id);
	}

	@Patch(':id')
	async updateProblem(
		@UUIDParam('id') id: Uuid,
		@Body() updateProblemDto: UpdateProblemDto,
	) {
		return this.problemsService.updateProblem(id, updateProblemDto);
	}

	@Delete(':id/testcase')
	async deleteTestcase(
		@UUIDParam('id') id: Uuid,
		@Body() deleteTestcaseDto: DeleteTestcaseDto,
	) {
		return this.problemsService.deleteTestcase(id, deleteTestcaseDto);
	}
}
