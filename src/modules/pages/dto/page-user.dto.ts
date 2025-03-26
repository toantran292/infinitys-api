import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleTypePage } from '../../../constants/role-type';
import { EnumFieldOptional } from '../../../decoractors/field.decoractors';
import { UserResponseDto } from '../../users/dto/user-response.dto';

import { PageResponseDto } from './page-response.dto';
export type PageUserDtoOptions = Partial<{}>;

export class PageUserDto extends AbstractDto {
	@Expose()
	@EnumFieldOptional(() => RoleTypePage)
	role?: RoleTypePage;

	@Expose()
	@Type(() => UserResponseDto)
	user?: UserResponseDto;

	@Expose()
	@Type(() => PageResponseDto)
	page?: PageResponseDto;
}
