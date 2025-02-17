import { Controller, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { GetUser } from '../../decoractors/ower-or-admin.decorators';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post('request')
	async sendFriendRequest(@GetUser() user, @Body() dto: CreateFriendRequestDto) {
		console.log("sendFriendRequest",user);
		return this.friendService.sendFriendRequest(user.userId, dto.targetId);
	}

	@Patch('request/accept/:requestId')
	async acceptFriendRequest(@GetUser() user: UserEntity, @Param('requestId') requestId: string) {
		return this.friendService.acceptFriendRequest(requestId);
	}

	@Patch('request/reject/:requestId')
	async rejectFriendRequest(@GetUser() user: UserEntity, @Param('requestId') requestId: string) {
		return this.friendService.rejectFriendRequest(requestId);
	}

	@Patch('unrequest/:friendId')
	async removeFriendRequest(@GetUser() user, @Param('friendId') friendId: string) {
		return this.friendService.removeFriendRequest(user.userId,friendId);
	}
}
