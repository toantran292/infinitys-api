import { IsOptional } from 'class-validator';
import { StringFieldOptional } from '../../../decoractors/field.decoractors';
import { URLFieldOptional } from '../../../decoractors/field.decoractors';

export class UpdatePageDto {
	@StringFieldOptional()
	name?: string;

	@StringFieldOptional()
	content?: string;

	@StringFieldOptional()
	address?: string;

	@URLFieldOptional()
	url?: string;

	@IsOptional()
	avatar?: {
		key: string;
		name: string;
		content_type: string;
		size: number;
	};
}

export class AdminUpdatePageDto extends UpdatePageDto {}
