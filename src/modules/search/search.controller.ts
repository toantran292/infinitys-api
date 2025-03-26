import { Controller, Get, Query, SerializeOptions } from '@nestjs/common';

import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { PaginationListSearchResponseDto } from './dto/list-search-response.dto';
import { SearchPageOptionDto } from './dto/search-page-option.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@SerializeOptions({ type: PaginationListSearchResponseDto })
	@Get('user')
	@Auth()
	searchUser(@AuthUser() user: User, @Query() query: SearchPageOptionDto) {
		return this.searchService.searchUser(user, query);
	}
}
