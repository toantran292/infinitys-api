import { IsUUID } from 'class-validator';

export class CreateFriendRequestDto {
	@IsUUID()
	targetId!: string;
}

export class AcceptFriendRequestDto {
	@IsUUID()
	requestId!: string;
}
