import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UUIDField } from 'src/decoractors/field.decoractors';

export enum REACT_TARGET_TYPE {
    POST = 'posts',
    COMMENT = 'comments'
}

export class CreateReactDto {
    @UUIDField()
    @IsNotEmpty()
    targetId: Uuid;

    @IsEnum(REACT_TARGET_TYPE)
    @IsNotEmpty()
    targetType: REACT_TARGET_TYPE;
}