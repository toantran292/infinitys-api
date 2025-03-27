import { Type } from 'class-transformer';
import {
	IsEnum,
	IsInt,
	IsOptional,
	Max,
	Min,
	IsBoolean,
} from 'class-validator';

import { StringFieldOptional } from '../../decoractors/field.decoractors';
import { Order } from '../constants';

export class PageOptionsDto {
	@IsEnum(Order)
	@IsOptional()
	readonly order?: Order = Order.ASC;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	readonly take?: number = 10;

	@IsBoolean()
	@IsOptional()
	readonly active?: boolean = true;

	get skip(): number {
		return (this.page - 1) * this.take;
	}

	@StringFieldOptional()
	readonly q?: string;
}
