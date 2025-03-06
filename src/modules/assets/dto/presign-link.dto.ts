import { StringField } from '../../../decoractors/field.decoractors';
import { FileType } from '../assets.service';

export class PresignLinkDto {
	@StringField()
	readonly type!: FileType;

	@StringField()
	readonly suffix!: string;

	constructor(type: FileType, suffix: string) {
		this.type = type;
		this.suffix = suffix;
	}
}
