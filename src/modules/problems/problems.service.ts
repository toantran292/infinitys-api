import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ProblemEntity } from './entities/problem.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetsService, FileType } from 'src/modules/assets/assets.service';
import { getAssetFields } from 'src/decoractors/asset.decoractor';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { AssetEntity } from '../assets/entities/asset.entity';
import { DeleteTestcaseDto } from './dto/delete-testcase.dto';
@Injectable()
export class ProblemsService {
	constructor(
		@InjectRepository(ProblemEntity)
		private problemRepository: Repository<ProblemEntity>,

		private readonly assetsService: AssetsService,
	) {}

	async createProblem(createProblemDto: CreateProblemDto) {
		const { content, title } = createProblemDto;

		const problem = this.problemRepository.create({
			content,
			title,
		});

		const savedProblem = await this.problemRepository.save(problem);

		const fieldToAddAssets = getAssetFields(ProblemEntity);
		for (const field of fieldToAddAssets) {
			if (createProblemDto[field.propertyKey]) {
				await this.assetsService.addAssetsToEntity(
					savedProblem,
					createProblemDto[field.propertyKey].map((asset) => ({
						type: field.type,
						file_data: asset,
					})),
				);
			}
		}

		return savedProblem;
	}

	async updateProblem(id: Uuid, updateProblemDto: UpdateProblemDto) {
		const { content, title } = updateProblemDto;

		const problem = await this.problemRepository.findOne({
			where: { id },
		});

		if (!problem) {
			throw new NotFoundException('Problem not found');
		}

		problem.content = content;
		problem.title = title;

		await this.problemRepository.save(problem);

		const fieldToAddAssets = getAssetFields(problem);
		for (const field of fieldToAddAssets) {
			if (updateProblemDto[field.propertyKey]) {
				await this.assetsService.addAssetsToEntity(
					problem,
					updateProblemDto[field.propertyKey].map((asset) => ({
						type: field.type,
						file_data: asset,
					})),
				);
			}
		}

		await this.assetsService.attachAssetToEntity(problem);

		return {
			...problem,
			testcases: this.transformTestcases(problem),
		};
	}

	async getProblems(
		pageOptionsDto: ProblemPageOptionDto,
	): Promise<{ items: ProblemEntity[]; meta: PageMetaDto }> {
		const [items, pageMeta] = await this.problemRepository
			.createQueryBuilder('problem')
			.paginate(pageOptionsDto);

		await this.assetsService.attachAssetToEntities(items);

		return {
			items,
			meta: pageMeta,
		};
	}

	async getProblem(problemId: Uuid) {
		const problem = await this.problemRepository.findOne({
			where: { id: problemId },
		});

		await this.assetsService.attachAssetToEntity(problem);

		return {
			...problem,
			testcases: this.transformTestcases(problem),
		};
	}

	private transformTestcases(problem: ProblemEntity) {
		const testcaseGroups = new Map<
			string,
			{ input?: AssetEntity; output?: AssetEntity }
		>();

		for (const asset of problem.testcases) {
			const fileName = asset.file_data.name;
			const testcaseName = fileName.split('.')[0]; // "testcase_1"
			const fileType = fileName.split('.')[1]; // "in" or "out"

			if (!testcaseGroups.has(testcaseName)) {
				testcaseGroups.set(testcaseName, {});
			}

			const group = testcaseGroups.get(testcaseName)!;
			if (fileType === 'in') {
				group.input = asset;
			} else if (fileType === 'out') {
				group.output = asset;
			}
		}

		return Array.from(testcaseGroups.entries()).map(
			([name, { input, output }]) => ({
				name,
				input: input?.id
					? {
							id: input?.id,
							url: input?.url,
						}
					: null,
				output: output?.id
					? {
							id: output?.id,
							url: output?.url,
						}
					: null,
			}),
		);
	}

	async deleteTestcase(problemId: Uuid, deleteTestcaseDto: DeleteTestcaseDto) {
		const { input_id, output_id } = deleteTestcaseDto;

		const problem = await this.problemRepository.findOne({
			where: { id: problemId },
		});

		if (!problem) {
			throw new NotFoundException('Problem not found');
		}

		await this.assetsService.deleteAssets(
			[input_id, output_id],
			problemId,
			problem.entityType,
		);

		await this.assetsService.attachAssetToEntity(problem);

		return {
			...problem,
			testcases: this.transformTestcases(problem),
		};
	}
}
