import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { SendFriendRequestDto } from './dto/create-friend-request.dto';
import { GetUser } from '../../decoractors/ower-or-admin.decorators';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post('request')
	async sendFriendRequest(@GetUser() user, @Body() dto: SendFriendRequestDto) {
		return this.friendService.sendFriendRequest(user.userId, dto.targetId);
	}

	@Post('request/:requestId/accept')
	async acceptFriendRequest(@GetUser() user: UserEntity, @Param('requestId') requestId: string) {
		return this.friendService.acceptFriendRequest(requestId);
	}

	@Post('request/:requestId/reject')
	async rejectFriendRequest(@GetUser() user: UserEntity, @Param('requestId') requestId: string) {
		return this.friendService.rejectFriendRequest(requestId);
	}

	@Post(':friendId/unrequest')
	async removeFriendRequest(@GetUser() user, @Param('friendId') friendId: string) {
		return this.friendService.removeFriendRequest(user.userId,friendId);
	}
}
