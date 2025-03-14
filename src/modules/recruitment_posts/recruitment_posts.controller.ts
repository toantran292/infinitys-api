import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RecruitmentPostsService } from './recruitment_posts.service';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { UserEntity } from '../users/entities/user.entity';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { Auth } from 'src/decoractors/http.decorators';
import { RoleType } from 'src/constants/role-type';
import { RecruitmentPostDto } from './dto/recruitment-post.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('api/recruitment-posts')
export class RecruitmentPostsController {
    constructor(private readonly recruitmentPostsService: RecruitmentPostsService) { }

    @Get()
    async getAllPosts(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<RecruitmentPostDto>> {
        return this.recruitmentPostsService.getAllPosts(pageOptionsDto);
    }

    @Get(':id')
    async getRecruitmentPost(@Param('id') id: string): Promise<RecruitmentPostDto> {
        return this.recruitmentPostsService.getRecruitmentPost(id);
    }

    @Post()
    @Auth([RoleType.USER])
    async createPost(
        @AuthUser() user: UserEntity,
        @Body() post: CreateRecruitmentPostDto
    ) {
        return this.recruitmentPostsService.createPost(user, post);
    }
}
