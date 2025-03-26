import { IsArray } from 'class-validator';

import { StringField } from '../../../decoractors/field.decoractors';
import { CreateAssetDto } from '../../assets/dto/create-asset.dto';

export class CreatePostDto {
	@StringField()
	content: string;

	@IsArray()
	images: CreateAssetDto[];
}
