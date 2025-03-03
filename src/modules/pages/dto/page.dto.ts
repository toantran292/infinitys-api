import { PageEntity } from '../entities/page.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { PageStatus } from '../../../constants/page-status';

export type PageDtoOptions = Partial<{ isActive: boolean }>;

export class PageDto extends AbstractDto {
	@IsNotEmpty({ message: 'Tên không được để trống' })
	name!: string;

	@IsNotEmpty({ message: 'Hãy điền địa chỉ' })
	address!: string;

	@IsNotEmpty({ message: 'Hãy điền trang Công ty' })
	url!: string;

	@IsEmail()
	email!: string;

	@IsNotEmpty()
	status!: PageStatus;

	constructor(page: PageEntity) {
		super(page);
		this.name = page.name;
		this.address = page.address;
		this.url = page.url;
		this.email = page.email;
		this.status = page.status;
	}
}
