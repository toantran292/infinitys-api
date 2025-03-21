import { IsEnum, IsNotEmpty } from 'class-validator';
import { REACT_TARGET_TYPE } from './create-react.dto';
import { UUIDField } from 'src/decoractors/field.decoractors';

export class GetReactByTargetIdDto {
    @UUIDField()
    @IsNotEmpty()
    targetId: Uuid;

    @IsEnum(REACT_TARGET_TYPE)
    @IsNotEmpty()
    targetType: REACT_TARGET_TYPE;
} 