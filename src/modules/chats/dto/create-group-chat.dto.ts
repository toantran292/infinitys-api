import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class CreateGroupChatDto {
	@IsArray()
	@IsUUID('4', { each: true })
	@IsNotEmpty()
	userIds: Uuid[];

	@IsString()
	@IsOptional()
	name?: string;
}
