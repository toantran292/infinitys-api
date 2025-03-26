import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { Problem } from './entities/problem.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetsService, FileType } from 'src/modules/assets/assets.service';
import { getAssetFields } from 'src/decoractors/asset.decoractor';
import { ProblemPageOptionDto } from './dto/problem-page-option';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { AssetEntity } from '../assets/entities/asset.entity';
import { DeleteTestcaseDto } from './dto/delete-testcase.dto';
import { SubmitProblemDto } from './dto/submit-problem.dto';
import { OJService } from 'src/shared/services/oj.service';
import { SubmissionResult } from './problems.type';
import { TestCaseResult } from './problems.type';
import { Submission, SubmissionSummary } from './entities';

@Injectable()
export class ProblemsService {
	constructor(
		@InjectRepository(Problem)
		private problemRepository: Repository<Problem>,

		@InjectRepository(Submission)
		private submissionRepository: Repository<Submission>,

		@InjectRepository(SubmissionSummary)
		private submissionSummaryRepository: Repository<SubmissionSummary>,

		private readonly assetsService: AssetsService,
		private readonly ojService: OJService,
	) {}

	async createProblem(createProblemDto: CreateProblemDto) {
		const {
			content,
			title,
			difficulty,
			timeLimit,
			memoryLimit,
			examples,
			constraints,
		} = createProblemDto;

		const problem = this.problemRepository.create({
			content,
			title,
			difficulty,
			timeLimit,
			memoryLimit,
			examples,
			constraints,
		});

		const savedProblem = await this.problemRepository.save(problem);

		const fieldToAddAssets = getAssetFields(Problem);
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
		const {
			content,
			title,
			difficulty,
			timeLimit,
			memoryLimit,
			examples,
			constraints,
		} = updateProblemDto;

		const problem = await this.problemRepository.findOne({
			where: { id },
		});

		if (!problem) {
			throw new NotFoundException('Problem not found');
		}

		problem.content = content;
		problem.title = title;
		problem.difficulty = difficulty;
		problem.timeLimit = timeLimit;
		problem.memoryLimit = memoryLimit;
		problem.examples = examples;
		problem.constraints = constraints;

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
		attachAssets: boolean = true,
		userId?: Uuid,
	): Promise<{ items: Problem[]; meta: PageMetaDto }> {
		const queryBuilder = this.problemRepository
			.createQueryBuilder('problem')
			// Count tổng số submissions
			.loadRelationCountAndMap(
				'problem.totalSubmissions',
				'problem.submissions',
				'submissions',
			);

		// Count số submissions AC
		queryBuilder.loadRelationCountAndMap(
			'problem.totalAccepted',
			'problem.submissions',
			'acceptedSubmissions',
			(qb) =>
				qb.where('acceptedSubmissions.summary ::jsonb @> :status', {
					status: JSON.stringify({ status: 'AC' }),
				}),
		);

		// Nếu có userId, join với submission summary
		if (userId) {
			queryBuilder.leftJoinAndSelect(
				'problem.submissionSummaries',
				'summary',
				'summary.user_id = :userId',
				{ userId },
			);
		}

		// Apply pagination
		const [items, pageMeta] = await queryBuilder.paginate(pageOptionsDto);

		// Transform response
		const transformedItems = items.map((problem) => {
			const transformed = {
				...problem,
				statistics: {
					totalSubmissions: (problem as any).totalSubmissions || 0,
					totalAccepted: (problem as any).totalAccepted || 0,
				},
				userStatus: null,
			};

			// Add user status if available
			if (problem.submissionSummaries?.[0]) {
				const summary = problem.submissionSummaries[0];
				transformed.userStatus = {
					attempted: summary.total > 0,
					solved: summary.accepted > 0,
					submissions: {
						total: summary.total,
						accepted: summary.accepted,
						wrongAnswer: summary.wrongAnswer,
						timeLimitExceeded: summary.timeLimitExceeded,
						runtimeError: summary.runtimeError,
						compilationError: summary.compilationError,
					},
					bestSubmission:
						summary.accepted > 0
							? {
									runtime: summary.bestRuntime,
									memory: summary.bestMemory,
								}
							: null,
				};
			}

			// Clean up internal fields
			delete (transformed as any).submissionSummaries;
			return transformed;
		});

		if (attachAssets) {
			await this.assetsService.attachAssetToEntities(
				transformedItems as unknown as Problem[],
			);
		}

		console.log(transformedItems);

		return {
			items: transformedItems as unknown as Problem[],
			meta: pageMeta,
		};
	}

	async getProblem(problemId: Uuid, attachAssets: boolean = true) {
		const problem = await this.problemRepository.findOne({
			where: { id: problemId },
		});

		if (attachAssets) {
			await this.assetsService.attachAssetToEntity(problem);
		}

		return {
			...problem,
			testcases: this.transformTestcases(problem),
		};
	}

	private transformTestcases(problem: Problem) {
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

	async submitProblem(
		userId: Uuid,
		problemId: Uuid,
		submitProblemDto: SubmitProblemDto,
	) {
		const { code, language } = submitProblemDto;

		const problem = await this.problemRepository.findOne({
			where: { id: problemId },
		});

		if (!problem) {
			throw new NotFoundException('Problem not found');
		}

		const submission = this.submissionRepository.create({
			problem: { id: problemId },
			user: { id: userId },
			code,
		});

		await this.submissionRepository.save(submission);

		await this.ojService.submitProblem({
			problemId,
			submissionId: submission.id,
			codeContent: code,
			language,
			timeLimit: problem.timeLimit / 1000,
			memoryLimit: problem.memoryLimit / 1024,
		});
		return submission;
	}

	async updateSubmission(
		submissionId: Uuid,
		testCaseResults: TestCaseResult[],
	) {
		const submission = await this.submissionRepository.findOne({
			where: { id: submissionId },
			relations: ['problem', 'user'],
		});

		if (!submission) {
			throw new NotFoundException('Submission not found');
		}

		// Tính toán kết quả submission
		const submissionResult = this.calculateSubmissionResult(testCaseResults);

		// Cập nhật submission
		submission.result = testCaseResults;
		submission.summary = submissionResult;
		await this.submissionRepository.save(submission);

		// Cập nhật hoặc tạo mới submission summary
		await this.updateSubmissionSummary(
			submission.problem.id,
			submission.user.id,
			submissionResult,
		);
	}

	private async updateSubmissionSummary(
		problemId: Uuid,
		userId: Uuid,
		submissionResult: SubmissionResult,
	) {
		let summary = await this.submissionSummaryRepository.findOne({
			where: {
				problem: { id: problemId },
				user: { id: userId },
			},
		});

		if (!summary) {
			summary = this.submissionSummaryRepository.create({
				problem: { id: problemId },
				user: { id: userId },
			});
		}

		// Cập nhật tổng số submission
		summary.total += 1;

		// Cập nhật counter theo status
		switch (submissionResult.status) {
			case 'AC':
				summary.accepted += 1;
				break;
			case 'WA':
				summary.wrongAnswer += 1;
				break;
			case 'TLE':
				summary.timeLimitExceeded += 1;
				break;
			case 'RE':
				summary.runtimeError += 1;
				break;
			case 'CE':
				summary.compilationError += 1;
				break;
		}

		// Cập nhật best runtime và memory nếu AC
		if (submissionResult.status === 'AC') {
			summary.bestRuntime =
				summary.bestRuntime === 0
					? submissionResult.runtime
					: Math.min(summary.bestRuntime, submissionResult.runtime);

			summary.bestMemory =
				summary.bestMemory === 0
					? submissionResult.memory
					: Math.min(summary.bestMemory, submissionResult.memory);
		}

		await this.submissionSummaryRepository.save(summary);
	}

	async getSubmissions(problemId: Uuid, userId?: Uuid) {
		const submissions = await this.submissionRepository.find({
			where: {
				problem: { id: problemId },
				user: userId ? { id: userId } : undefined,
			},
			order: { createdAt: 'DESC' },
		});
		return submissions;
	}

	async getSubmissionSummary(problemId: Uuid, userId: Uuid) {
		let summary = await this.submissionSummaryRepository.findOne({
			where: {
				problem: { id: problemId },
				user: { id: userId },
			},
		});

		if (!summary) {
			summary = this.submissionSummaryRepository.create({
				problem: { id: problemId },
				user: { id: userId },
			});
			await this.submissionSummaryRepository.save(summary);
		}

		return summary;
	}

	private calculateSubmissionResult(
		testCaseResults: TestCaseResult[],
	): SubmissionResult {
		// Trường hợp không có kết quả hoặc CE
		if (!testCaseResults || testCaseResults.length === 0) {
			return {
				status: 'CE',
				runtime: 0,
				memory: 0,
				totalTestCases: 0,
				passedTestCases: 0,
				failedTestCase: {
					testcase: 0,
					status: 'CE',
					runtime: 0,
					memory: 0,
				},
			};
		}

		const result: SubmissionResult = {
			status: 'AC',
			runtime: 0,
			memory: 0,
			totalTestCases: testCaseResults.length,
			passedTestCases: 0,
		};

		// Kiểm tra CE trước
		if (testCaseResults.some((testCase) => testCase.status === 'CE')) {
			return {
				...result,
				status: 'CE',
				failedTestCase: testCaseResults[0],
			};
		}

		// Xử lý từng test case
		for (const testCase of testCaseResults) {
			// Cập nhật runtime và memory tối đa
			result.runtime = Math.max(result.runtime, testCase.runtime);
			result.memory = Math.max(result.memory, testCase.memory);

			if (testCase.status === 'AC') {
				result.passedTestCases++;
			} else {
				// Lưu test case đầu tiên bị fail
				if (!result.failedTestCase) {
					result.failedTestCase = testCase;
				}

				// Cập nhật status theo độ ưu tiên: RE > TLE > WA
				if (
					testCase.status === 'RE' ||
					(testCase.status === 'TLE' && result.status !== 'RE') ||
					(testCase.status === 'WA' &&
						result.status !== 'RE' &&
						result.status !== 'TLE')
				) {
					result.status = testCase.status;
				}
			}
		}

		// Kiểm tra kết quả cuối cùng
		if (result.passedTestCases !== result.totalTestCases) {
			result.status = result.failedTestCase?.status || 'WA';
		}

		return result;
	}
}
