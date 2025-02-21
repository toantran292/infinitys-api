import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { Auth } from '../../decoractors/http.decorators';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('user')
  @Auth()
  searchUser(@Query() query: {q: string}) {
    return this.searchService.searchUser(query.q);
  }
}
