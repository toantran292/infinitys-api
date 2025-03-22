import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UserEntity } from '../users/entities/user.entity';
import { ApplicationEntity } from './entities/application.entity';
import { AuthUser } from 'src/decoractors/auth-user.decorators';
import { RoleType, RoleTypePage } from 'src/constants/role-type';
import { Auth } from 'src/decoractors/http.decorators';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('api/applications')
export class ApplicationsController {
	constructor(private readonly applicationsService: ApplicationsService) {}

	@Post()
	@Auth([RoleType.USER])
	async createApplication(
		@AuthUser() user: UserEntity,
		@Body() body: { jobId: Uuid },
	): Promise<ApplicationEntity> {
		return this.applicationsService.createApplication(user, body.jobId);
	}

	@Get(':id')
	@Auth([RoleType.USER])
	async getApplication(
		@AuthUser() user: UserEntity,
		@Param('id') id: Uuid,
	): Promise<ApplicationEntity> {
		return this.applicationsService.getApplicationById(id, user);
	}
}
