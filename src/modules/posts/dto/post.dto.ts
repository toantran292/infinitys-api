import { UserDto } from 'src/modules/users/dto/user.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export type PostDtoOptions = {};

export class PostDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose()
	@Type(() => UserResponseDto)
	author: UserResponseDto;

	@Expose()
	comment_count: number;

	@Expose()
	react_count: number;
}

