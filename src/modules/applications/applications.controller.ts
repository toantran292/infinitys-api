import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	SerializeOptions,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { ApplicationsService } from './applications.service';
import { ApplicationResponseDto } from './dtos/application-response.dto';
import { ApplicationEntity } from './entities/application.entity';

@Controller('api/applications')
export class ApplicationsController {
	constructor(private readonly applicationsService: ApplicationsService) {}

	@SerializeOptions({
		type: ApplicationResponseDto,
	})
	@Post()
	@Auth([RoleType.USER])
	async createApplication(
		@AuthUser() user: User,
		@Body() body: { jobId: Uuid },
	): Promise<ApplicationEntity> {
		return this.applicationsService.createApplication(user, body.jobId);
	}

	@SerializeOptions({
		type: ApplicationResponseDto,
	})
	@Get(':id')
	@Auth([RoleType.USER])
	async getApplication(
		@AuthUser() user: User,
		@Param('id') id: Uuid,
	): Promise<ApplicationEntity> {
		return this.applicationsService.getApplicationById(id, user);
	}
}
