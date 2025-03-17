import { Controller, Post, Body } from "@nestjs/common";
import { ReactsService } from "./reacts.services";
import { CreateReactDto } from "./dto/create-react.dto";
import { Auth } from "src/decoractors/http.decorators";
import { AuthUser } from "src/decoractors/auth-user.decorators";
import { UserEntity } from "../users/entities/user.entity";
import { RoleType } from "src/constants/role-type";


@Controller('api/reacts')
export class ReactsController {
    constructor(private readonly reactsService: ReactsService) { }

    @Post()
    @Auth([RoleType.USER])
    async react(
        @AuthUser() user: UserEntity,
        @Body() createReactDto: CreateReactDto) {
        return this.reactsService.createReact(user, createReactDto);
    }
}