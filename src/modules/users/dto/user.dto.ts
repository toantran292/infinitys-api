import {AbstractDto} from "../../../common/dto/abstract.dto";
import {EmailField, EnumFieldOptional, StringField} from "../../../decoractors/field.decoractors";
import {UserEntity} from "../entities/user.entity";
import {RoleType} from "../../../constants/role-type";

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDTo extends AbstractDto {
    @StringField()
    first_name!: string;

    @StringField()
    last_name!: string;

    @EnumFieldOptional(() => RoleType)
    role?: RoleType;

    @EmailField()
    email!: string;

    constructor(user: UserEntity, options?: UserDtoOptions) {
        super(user);
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
    }
}