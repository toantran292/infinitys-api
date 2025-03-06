import {
	NumberField,
	StringField,
} from '../../../decoractors/field.decoractors';
import { FileType } from '../../assets/assets.service';
//
// {
// 	"avatar": {
// 	"name": "OIP.jpg",
// 		"type": "image/jpeg",
// 		"size": 44272,
// 		"lastModified": 1740637206716,
// 		"webkitRelativePath": ""
// }
// }

export class AvatarDto {
	@StringField()
	key!: string;

	@NumberField()
	readonly size!: number;

	@StringField()
	readonly name!: string;

	@StringField()
	readonly content_type!: string;

	constructor(size: number, name: string, content_type: FileType) {
		this.size = size;
		this.name = name;
		this.content_type = content_type;
	}
}
