import {
	NumberField,
	StringField,
} from '../../../decoractors/field.decoractors';
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
}

export class BannerDto extends AvatarDto {}
