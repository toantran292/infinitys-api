import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { AssetsService } from '../assets/assets.service';
import {
	FriendshipStatus,
	FriendStatus,
} from '../users/entities/friend.entity';
import {
	SearchResult,
	SearchResultType,
	UserSearchResult,
	PageSearchResult,
} from './interfaces/search.interface';

import { UserSearchDocument } from './interfaces/user.interface';
import { PageSearchDocument } from './interfaces/page.interface';
import { FriendService } from '../users/friend.service';

@Injectable()
export class SearchService implements OnModuleInit {
	private readonly userIndex = 'users';
	private readonly pageIndex = 'pages';

	constructor(
		private readonly elasticsearchService: ElasticsearchService,
		private readonly friendService: FriendService,
		private readonly assetService: AssetsService,
	) {}

	async onModuleInit() {
		await this.createIndices();
	}

	private async createIndices() {
		const userIndexExists = await this.elasticsearchService.indices.exists({
			index: this.userIndex,
		});

		if (!userIndexExists) {
			await this.elasticsearchService.indices.create({
				index: this.userIndex,
				body: {
					settings: {
						analysis: {
							analyzer: {
								autocomplete: {
									type: 'custom',
									tokenizer: 'standard',
									filter: ['lowercase', 'autocomplete_filter'],
								},
							},
							filter: {
								autocomplete_filter: {
									type: 'edge_ngram',
									min_gram: 1,
									max_gram: 20,
								},
							},
						},
					},
					mappings: {
						properties: {
							id: { type: 'keyword' },
							firstName: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
								fields: {
									keyword: { type: 'keyword' },
								},
							},
							lastName: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
								fields: {
									keyword: { type: 'keyword' },
								},
							},
							email: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
							},
							avatar: {
								properties: {
									key: { type: 'keyword' },
								},
							},
						},
					},
				},
			});
		}

		const pageIndexExists = await this.elasticsearchService.indices.exists({
			index: this.pageIndex,
		});

		if (!pageIndexExists) {
			await this.elasticsearchService.indices.create({
				index: this.pageIndex,
				body: {
					settings: {
						analysis: {
							analyzer: {
								autocomplete: {
									type: 'custom',
									tokenizer: 'standard',
									filter: ['lowercase', 'autocomplete_filter'],
								},
							},
							filter: {
								autocomplete_filter: {
									type: 'edge_ngram',
									min_gram: 1,
									max_gram: 20,
								},
							},
						},
					},
					mappings: {
						properties: {
							id: { type: 'keyword' },
							name: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
								fields: {
									keyword: { type: 'keyword' },
								},
							},
							content: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
							},
							address: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
								fields: {
									keyword: { type: 'keyword' },
								},
							},
							url: {
								type: 'text',
								fields: {
									keyword: { type: 'keyword' },
								},
							},
							email: {
								type: 'text',
								analyzer: 'autocomplete',
								search_analyzer: 'standard',
							},
							avatar: {
								properties: {
									key: { type: 'keyword' },
								},
							},
						},
					},
				},
			});
		}
	}

	private async getFriendshipStatus(
		userId: Uuid,
		targetId: Uuid,
	): Promise<FriendStatus> {
		const friendship = await this.friendService.findFriendship(
			userId,
			targetId,
		);

		return this.friendService.getFriendStatus(
			friendship?.status,
			userId,
			friendship,
		);
	}

	async search(
		query: string,
		currentUserId?: Uuid,
		isAutocomplete: boolean = false,
	) {
		const [userResults, pageResults] = await Promise.all([
			this.searchUsers(query, isAutocomplete),
			this.searchPages(query, isAutocomplete),
		]);

		const enrichedUserResults = currentUserId
			? await Promise.all(
					userResults.map(async (user: UserSearchDocument) => ({
						...user,
						friendStatus: await this.getFriendshipStatus(
							currentUserId,
							user.id,
						),
						avatar: {
							key: user.avatar?.key,
							...(await this.assetService.getViewUrl(user.avatar?.key)),
						},
					})),
				)
			: userResults;

		const enrichedPageResults = await Promise.all(
			pageResults.map(async (page: PageSearchDocument) => ({
				...page,
				avatar: {
					key: page.avatar?.key,
					...(await this.assetService.getViewUrl(page.avatar?.key)),
				},
			})),
		);

		const combinedResults: SearchResult[] = [
			...enrichedUserResults.map(
				(user: UserSearchResult) =>
					({
						...user,
						type: SearchResultType.USER,
						name: `${user.firstName} ${user.lastName}`,
					}) as UserSearchResult,
			),
			...enrichedPageResults.map(
				(page) =>
					({
						...page,
						type: SearchResultType.PAGE,
					}) as unknown as PageSearchResult,
			),
		];

		return combinedResults;
	}

	private async searchUsers(query: string, isAutocomplete: boolean) {
		const { hits } = await this.elasticsearchService.search({
			index: this.userIndex,
			body: {
				query: {
					bool: {
						must: [
							{
								multi_match: {
									query,
									fields: ['firstName', 'lastName', 'email'],
									type: isAutocomplete ? 'bool_prefix' : 'best_fields',
									fuzziness: isAutocomplete ? undefined : 'AUTO',
								},
							},
						],
					},
				},
			},
		});

		return hits.hits.map((hit) => hit._source);
	}

	private async searchPages(query: string, isAutocomplete: boolean) {
		const { hits } = await this.elasticsearchService.search({
			index: this.pageIndex,
			body: {
				query: {
					bool: {
						must: [
							{
								multi_match: {
									query,
									fields: ['name', 'content', 'address', 'email'],
									type: isAutocomplete ? 'bool_prefix' : 'best_fields',
									fuzziness: isAutocomplete ? undefined : 'AUTO',
								},
							},
						],
					},
				},
			},
		});

		return hits.hits.map((hit) => hit._source);
	}

	// Index user document
	async indexUser(user: UserSearchDocument) {
		return this.elasticsearchService.index({
			index: this.userIndex,
			id: user.id,
			body: user,
		});
	}

	// Index page document
	async indexPage(page: PageSearchDocument) {
		return this.elasticsearchService.index({
			index: this.pageIndex,
			id: page.id,
			body: page,
		});
	}

	// Delete user document
	async removeUser(userId: string) {
		try {
			await this.elasticsearchService.delete({
				index: this.userIndex,
				id: userId,
			});
		} catch (error) {
			// Handle document not found
		}
	}

	// Delete page document
	async removePage(pageId: string) {
		try {
			await this.elasticsearchService.delete({
				index: this.pageIndex,
				id: pageId,
			});
		} catch (error) {
			// Handle document not found
		}
	}
}
