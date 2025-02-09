import {Column, Entity, VirtualColumn} from "typeorm";
import {UseDto} from "../../../decoractors/use-dto.decorators";
import {UserDTo, UserDtoOptions} from "../dto/user.dto";
import {AbstractEntity} from "../../../common/abstract.entity";
import {RoleType} from "../../../constants/role-type";

@Entity({name: "users"})
@UseDto(UserDTo)
export class UserEntity extends AbstractEntity<UserDTo, UserDtoOptions> {
    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @VirtualColumn({
        query: (alias) =>
            `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
    })
    fullName!: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role!: RoleType;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({default: false})
    is_admin!: boolean;
}
