import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterPageDto {
	@IsNotEmpty({ message: 'Tên không được để trống' })
	name!: string;

	@IsOptional()
	content?: string;

	@IsNotEmpty({ message: 'Hãy điền địa chỉ' })
	address!: string;

	@IsNotEmpty({ message: 'Hãy điền trang Công ty' })
	url!: string;
}
