import { IsEnum, IsNotEmpty } from 'class-validator';

import { UUIDField } from '../../../decoractors/field.decoractors';

export enum REACT_TARGET_TYPE {
	POST = 'posts',
	COMMENT = 'comments',
}

export class CreateReactDto {
	@UUIDField()
	@IsNotEmpty()
	targetId: Uuid;

	@IsEnum(REACT_TARGET_TYPE)
	@IsNotEmpty()
	targetType: REACT_TARGET_TYPE;
}
