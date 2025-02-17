import { IsUUID } from 'class-validator';

export class CreateFriendRequestDto {
	@IsUUID()
	targetId!: string; // ID của người muốn kết bạn
}

export class AcceptFriendRequestDto {
	@IsUUID()
	requestId!: string; // ID của lời mời kết bạn cần chấp nhận
}
