import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class SearchGroupChatsByMembersDto {
	@IsArray()
	@IsUUID('4', { each: true })
	@IsNotEmpty()
	memberIds: Uuid[];
}
