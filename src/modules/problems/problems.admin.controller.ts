import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	SerializeOptions,
	Query,
	Patch,
	Delete,
} from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ProblemsService } from './problems.service';
import { Auth, UUIDParam } from 'src/decoractors/http.decorators';
import { RoleType } from 'src/constants/role-type';
import { AdminProblemResponseDto } from './dto/problem-response.dto';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { AdminPaginatedProblemsResponseDto } from './dto/list-problems-response.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { DeleteTestcaseDto } from './dto/delete-testcase.dto';

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
