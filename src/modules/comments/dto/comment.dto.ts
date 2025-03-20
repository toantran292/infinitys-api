import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommentEntity } from '../entities/comment.entity';
import { UserDto } from '../../users/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { StringField } from '../../../decoractors/field.decoractors';

export type CommentDtoOptions = {};

export class CommentDto extends AbstractDto {
	content: string;
	
	author: UserDto;

	constructor(comment: CommentEntity) {
		super(comment);
		this.content = comment.content;
		this.author = new UserDto(comment.user);
	}
}

export class CreateCommentDto {
	@StringField()
	@IsNotEmpty()
	content: string;
}
