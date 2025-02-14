import { IsNotEmpty } from 'class-validator';

export class RegisterPageDto {
	@IsNotEmpty()
	name: string;
}