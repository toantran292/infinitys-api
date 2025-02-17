import { IsUUID } from 'class-validator';

export class SendFriendRequestDto {
	@IsUUID()
	targetId!: string;
}

export class AcceptFriendRequestDto {
	@IsUUID()
	requestId!: string;
}
