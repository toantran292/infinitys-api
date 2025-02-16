import { IsNotEmpty } from 'class-validator';

export class RegisterPageDto {
	@IsNotEmpty({ message: 'Tên không được để trống' })
	name!: string;

	@IsNotEmpty()
	content!: string;

	@IsNotEmpty({ message: 'Hãy điền địa chỉ' })
	address!: string;

	@IsNotEmpty({ message: 'Hãy điền trang Công ty' })
	url!: string;
}