import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { Auth } from '../../decoractors/http.decorators';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('user')
  @Auth()
  searchUser(
    @AuthUser() user: UserEntity,
    @Query() query: {q: string}
  ) {
    return this.searchService.searchUser(user, query.q);
  }
}
