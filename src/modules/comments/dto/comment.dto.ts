import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommentEntity } from '../entities/comment.entity';
import { UserDto } from '../../users/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { StringField } from '../../../decoractors/field.decoractors';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export type CommentDtoOptions = {};

export class CommentDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose({ name: 'author' })
	@Type(() => UserResponseDto)
	user: UserResponseDto;

	@Expose()
	react_count: number;
}

export class CreateCommentDto {
	@StringField()
	@IsNotEmpty()
	content: string;
}
