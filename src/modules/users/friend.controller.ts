import { Body, Controller, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { SendFriendRequestDto } from './dto/create-friend-request.dto';
import { UserEntity } from './entities/user.entity';
import { Auth } from '../../decoractors/http.decorators';
import { RoleType } from '../../constants/role-type';
import { AuthUser } from '../../decoractors/auth-user.decorators';

@Controller('friends')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post('request')
	@Auth([RoleType.USER])
	async sendFriendRequest(
		@AuthUser() user: UserEntity,
		@Body() dto: SendFriendRequestDto,
	) {
		return this.friendService.sendFriendRequest(user.id, dto.targetId);
	}

	@Post('request/:requestId/accept')
	@Auth([RoleType.USER])
	async acceptFriendRequest(
		@AuthUser() user: UserEntity,
		@Param('requestId') requestId: string,
	) {
		return this.friendService.acceptFriendRequest(requestId);
	}

	@Post('request/:requestId/reject')
	@Auth([RoleType.USER])
	async rejectFriendRequest(
		@AuthUser() user: UserEntity,
		@Param('requestId') requestId: string,
	) {
		return this.friendService.rejectFriendRequest(requestId);
	}

	@Post(':friendId/unrequest')
	@Auth([RoleType.USER])
	async removeFriendRequest(
		@AuthUser() user: UserEntity,
		@Param('friendId') friendId: string,
	) {
		return this.friendService.removeFriendRequest(user.id, friendId);
	}
}
