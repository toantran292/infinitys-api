import { Controller, Post, Body, SerializeOptions } from '@nestjs/common';

import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { Auth } from '../../decoractors/http.decorators';
import { User } from '../users/entities/user.entity';

import { CreateReactDto } from './dto/create-react.dto';
import { GetReactByTargetIdDto } from './dto/get-react-by-target-id.dto';
import { ReactResponseDto } from './dto/react-response.dto';
import { ReactsService } from './reacts.services';

@Controller('api/reacts')
export class ReactsController {
	constructor(private readonly reactsService: ReactsService) {}

	@SerializeOptions({
		type: ReactResponseDto,
	})
	@Post()
	@Auth([RoleType.USER])
	async react(@AuthUser() user: User, @Body() createReactDto: CreateReactDto) {
		return this.reactsService.createReact(user, createReactDto);
	}

	@SerializeOptions({
		type: ReactResponseDto,
	})
	@Post(':targetId')
	@Auth([RoleType.USER])
	async getReactByTargetId(
		@AuthUser() user: User,
		@Body() { targetId, targetType }: GetReactByTargetIdDto,
	) {
		return this.reactsService.getReactByTargetId(user, targetId, targetType);
	}
}
