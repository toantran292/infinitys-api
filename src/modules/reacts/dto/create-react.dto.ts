import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { EnumField, UUIDField } from "src/decoractors/field.decoractors";

export enum REACT_TARGET_TYPE {
    POST = 'posts',
    COMMENT = 'comments',
}

export class CreateReactDto {
    @UUIDField()
    targetId: Uuid;

    @EnumField(() => REACT_TARGET_TYPE)
    targetType: REACT_TARGET_TYPE;
}