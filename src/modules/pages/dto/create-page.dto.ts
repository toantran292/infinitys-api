import { IsNotEmpty } from 'class-validator';

export class CreatePageDto {
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	content: string;
}