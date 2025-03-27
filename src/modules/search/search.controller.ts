import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { User } from '../users/entities/user.entity';
import { Auth } from '../../decoractors/http.decorators';
import { AuthUser } from '../../decoractors/auth-user.decorators';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	@Auth()
	async search(
		@Query('q') query: string,
		@Query('autocomplete') autocomplete?: boolean,
		@AuthUser() currentUser?: User,
	) {
		return await this.searchService.search(
			query,
			currentUser?.id,
			autocomplete,
		);
	}
}
