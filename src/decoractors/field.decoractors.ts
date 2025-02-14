import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsInt,
	IsNumber,
	IsPositive,
	IsString,
	IsUUID,
	Max,
	MaxLength,
	Min,
	MinLength,
	NotEquals,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNullable, IsUndefinable } from './validator.decorators';
import { ToArray, ToLowerCase, ToUpperCase } from './transform.decorators';
import { ApiEnumProperty } from './property.decorators';

interface IFieldOptions {
	each?: boolean;
	swagger?: boolean;
	nullable?: boolean;
	groups?: string[];
}

interface IStringFieldOptions extends IFieldOptions {
	minLength?: number;
	maxLength?: number;
	toLowerCase?: boolean;
	toUpperCase?: boolean;
}

interface INumberFieldOptions extends IFieldOptions {
	min?: number;
	max?: number;
	int?: boolean;
	isPositive?: boolean;
}

type IEnumFieldOptions = IFieldOptions;

export function NumberField(
	options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
	const decorators = [Type(() => Number)];

	if (options.nullable) {
		decorators.push(IsNullable({ each: options.each }));
	} else {
		decorators.push(NotEquals(null, { each: options.each }));
	}

	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({ type: Number, ...(options as ApiPropertyOptions) }),
		);
	}

	if (options.each) {
		decorators.push(ToArray());
	}

	if (options.int) {
		decorators.push(IsInt({ each: options.each }));
	} else {
		decorators.push(IsNumber({}, { each: options.each }));
	}

	if (typeof options.min === 'number') {
		decorators.push(Min(options.min, { each: options.each }));
	}

	if (typeof options.max === 'number') {
		decorators.push(Max(options.max, { each: options.each }));
	}

	if (options.isPositive) {
		decorators.push(IsPositive({ each: options.each }));
	}

	return applyDecorators(...decorators);
}

export function NumberFieldOptional(
	options: Omit<ApiPropertyOptions, 'type' | 'required'> &
		INumberFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		NumberField({ required: false, ...options }),
	);
}

export function UUIDField(
	options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> &
		IFieldOptions = {},
): PropertyDecorator {
	const decorators = [Type(() => String), IsUUID('4', { each: options.each })];

	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	if (options.each) {
		decorators.push(ToArray());
	}

	return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
	options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> &
		IFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		UUIDField({ required: false, ...options }),
	);
}

export function DateField(
	options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
	const decorators = [Type(() => Date), IsDate()];

	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({ type: Date, ...(options as ApiPropertyOptions) }),
		);
	}

	return applyDecorators(...decorators);
}

export function DateFieldOptional(
	options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		DateField({ ...options, required: false }),
	);
}

export function StringField(
	options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
	const decorators = [Type(() => String), IsString({ each: options.each })];

	if (options.nullable) {
		decorators.push(IsNullable({ each: options.each }));
	} else {
		decorators.push(NotEquals(null, { each: options.each }));
	}

	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({
				type: String,
				...(options as ApiPropertyOptions),
				isArray: options.each,
			}),
		);
	}

	const minLength = options.minLength ?? 1;

	decorators.push(MinLength(minLength, { each: options.each }));

	if (options.maxLength) {
		decorators.push(MaxLength(options.maxLength, { each: options.each }));
	}

	if (options.toLowerCase) {
		decorators.push(ToLowerCase());
	}

	if (options.toUpperCase) {
		decorators.push(ToUpperCase());
	}

	return applyDecorators(...decorators);
}

export function StringFieldOptional(
	options: Omit<ApiPropertyOptions, 'type' | 'required'> &
		IStringFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		StringField({ required: false, ...options }),
	);
}

export function EmailField(
	options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
	const decorators = [
		IsEmail(),
		StringField({ toLowerCase: true, ...options }),
	];

	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({ type: String, ...(options as ApiPropertyOptions) }),
		);
	}

	return applyDecorators(...decorators);
}

export function EmailFieldOptional(
	options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		EmailField({ required: false, ...options }),
	);
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function EnumField<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
		IEnumFieldOptions = {},
): PropertyDecorator {
	const enumValue = getEnum();
	const decorators = [IsEnum(enumValue, { each: options.each })];

	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	if (options.each) {
		decorators.push(ToArray());
	}

	if (options.swagger !== false) {
		decorators.push(
			ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
		);
	}

	return applyDecorators(...decorators);
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function EnumFieldOptional<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
		IEnumFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		EnumField(getEnum, { required: false, ...options }),
	);
}
