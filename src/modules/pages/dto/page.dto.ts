import { PageEntity } from '../entities/page.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PageStatus } from '../../../constants/page-status';
import { StringField } from '../../../decoractors/field.decoractors';
import { AssetEntity } from '../../assets/entities/asset.entity';

export type PageDtoOptions = Partial<{ isActive: boolean }>;

export class PageAvatarDto extends AbstractDto {
	@StringField()
	url!: string;

	constructor(avatar: AssetEntity) {
		super(avatar);
		this.url = avatar.url;
	}
}

export class PageDto extends AbstractDto {
	@IsNotEmpty({ message: 'Tên không được để trống' })
	name!: string;

	@IsNotEmpty({ message: 'Hãy điền địa chỉ' })
	address!: string;

	@IsNotEmpty({ message: 'Hãy điền trang Công ty' })
	url!: string;

	@IsString()
	content?: string;

	@IsEmail()
	email!: string;

	@IsNotEmpty()
	status!: PageStatus;

	avatar?: PageAvatarDto;

	admin_user_id?: Uuid;

	constructor(page: PageEntity) {
		super(page);
		this.name = page.name;
		this.address = page.address;
		this.url = page.url;
		this.email = page.email;
		this.status = page.status;
		this.content = page.content;

		this.avatar = page.avatar ? new PageAvatarDto(page.avatar[0]) : null;
		this.admin_user_id = page.admin_user_id;
	}
}
