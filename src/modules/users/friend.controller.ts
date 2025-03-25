import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	SerializeOptions,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { SendFriendRequestDto } from './dto/create-friend-request.dto';
import { User } from './entities/user.entity';
import { Auth, UUIDParam } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';
import { ListFriendResponseDto } from './dto/list-friend-response.dto';
@Controller('api/friends')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post(':userId')
	@Auth([RoleType.USER])
	async sendFriendRequest(
		@AuthUser() user: User,
		@UUIDParam('userId') userId: Uuid,
	) {
		return this.friendService.sendFriendRequest(user.id, userId);
	}

	@Post(':userId/accept')
	@Auth([RoleType.USER])
	async acceptFriendRequest(
		@AuthUser() user: User,
		@UUIDParam('userId') userId: Uuid,
	) {
		return this.friendService.acceptFriendRequest(user.id, userId);
	}

	@Post(':userId/reject')
	@Auth([RoleType.USER])
	async rejectFriendRequest(
		@AuthUser() user: User,
		@UUIDParam('userId') userId: Uuid,
	) {
		return this.friendService.rejectFriendRequest(user.id, userId);
	}

	@Post(':userId/cancel')
	@Auth([RoleType.USER])
	async cancelFriendRequest(
		@AuthUser() user: User,
		@UUIDParam('userId') userId: Uuid,
	) {
		return this.friendService.cancelFriendRequest(user.id, userId);
	}

	@SerializeOptions({ type: ListFriendResponseDto })
	@Get(':userId')
	@Auth([RoleType.USER])
	async getFriends(@UUIDParam('userId') userId: Uuid) {
		return this.friendService.getFriends(userId);
	}

	@Delete(':userId')
	@Auth([RoleType.USER])
	async unfriend(@AuthUser() user: User, @UUIDParam('userId') userId: Uuid) {
		return this.friendService.unfriend(user.id, userId);
	}
}
