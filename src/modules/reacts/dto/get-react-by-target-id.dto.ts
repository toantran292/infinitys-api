import { IsEnum, IsNotEmpty } from 'class-validator';

import { UUIDField } from '../../../decoractors/field.decoractors';

import { REACT_TARGET_TYPE } from './create-react.dto';

export class GetReactByTargetIdDto {
	@UUIDField()
	@IsNotEmpty()
	targetId: Uuid;

	@IsEnum(REACT_TARGET_TYPE)
	@IsNotEmpty()
	targetType: REACT_TARGET_TYPE;
}
