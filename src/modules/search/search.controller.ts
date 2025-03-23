import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	Query,
	SerializeOptions,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { Auth } from '../../decoractors/http.decorators';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { SearchPageOptionDto } from './dto/search-page-option.dto';
import { PaginationListSearchResponseDto } from './dto/list-search-response.dto';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@SerializeOptions({ type: PaginationListSearchResponseDto })
	@Get('user')
	@Auth()
	searchUser(
		@AuthUser() user: UserEntity,
		@Query() query: SearchPageOptionDto,
	) {
		return this.searchService.searchUser(user, query);
	}
}
