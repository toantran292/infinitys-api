import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
	@IsNotEmpty({ message: 'Tên không được để trống' })
	firstName: string;

	@IsNotEmpty({ message: 'Họ không được để trống' })
	lastName: string;

	@IsNotEmpty({ message: 'Email không được để trống' })
	@IsEmail({}, { message: 'Email không đúng' })
	email: string;

	@IsNotEmpty({ message: 'Mật khẩu không được để trống' })
	@MinLength(6, { message: 'Mật khẩu phải dài hơn 6 ký tự' })
	password: string;
}
