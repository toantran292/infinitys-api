import {
	IsOptional,
	IsString,
	IsEnum,
	IsDate,
	MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderType } from '../../../constants/gender-type';

export class UpdateUserProfileDto {
	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Tên quá ngắn' })
	firstName?: string;

	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Họ quá ngắn' })
	lastName?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate({ message: 'Định dạng ngày sinh không hợp lệ' })
	dateOfBirth?: Date;

	@IsOptional()
	@IsEnum(GenderType, { message: 'Giới tính không hợp lệ' })
	gender?: GenderType;

	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Tên chuyên ngành quá ngắn' })
	major?: string;

	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Tên vị trí làm việc không hợp lệ' })
	desiredJobPosition?: string;
}
