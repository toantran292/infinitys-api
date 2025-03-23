import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommentEntity } from '../entities/comment.entity';
import { UserDto } from '../../users/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { StringField } from '../../../decoractors/field.decoractors';
import { Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export type CommentDtoOptions = {};

export class CommentStatisticsDto extends AbstractDto {
	@Expose()
	reactCount: number;
}

export class CommentDto extends AbstractDto {
	@Expose()
	content: string;

	@Expose({ toClassOnly: true })
	@Type(() => UserResponseDto)
	user: UserResponseDto;

	@Expose()
	@Transform(({ obj }) => obj.user)
	@Type(() => UserResponseDto)
	author: UserResponseDto;

	@Expose({ toClassOnly: true })
	@Type(() => CommentStatisticsDto)
	statistics: CommentStatisticsDto;

	@Expose()
	@Transform(({ obj }) => obj.statistics?.reactCount || 0)
	@Type(() => Number)
	react_count: number;
}

export class CreateCommentDto {
	@StringField()
	@IsNotEmpty()
	content: string;
}
