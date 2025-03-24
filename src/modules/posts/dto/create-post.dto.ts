import { IsArray, IsString } from 'class-validator';
import { StringField } from 'src/decoractors/field.decoractors';
import { CreateAssetDto } from 'src/modules/assets/dto/create-asset.dto';

export class CreatePostDto {
	@StringField()
	content: string;

	@IsArray()
	images: CreateAssetDto[];
}
