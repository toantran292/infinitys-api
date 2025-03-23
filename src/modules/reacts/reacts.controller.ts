import { Controller, Post, Body, Query, Get, Param, SerializeOptions } from "@nestjs/common";
import { ReactsService } from "./reacts.services";
import { CreateReactDto, REACT_TARGET_TYPE } from "./dto/create-react.dto";
import { Auth } from "src/decoractors/http.decorators";
import { AuthUser } from "src/decoractors/auth-user.decorators";
import { UserEntity } from "../users/entities/user.entity";
import { RoleType } from "src/constants/role-type";
import { GetReactByTargetIdDto } from './dto/get-react-by-target-id.dto';
import { ReactResponseDto } from "./dto/react-response.dto";


@Controller('api/reacts')
export class ReactsController {
    constructor(private readonly reactsService: ReactsService) { }

    @SerializeOptions({
        type: ReactResponseDto
    })
    @Post()
    @Auth([RoleType.USER])
    async react(
        @AuthUser() user: UserEntity,
        @Body() createReactDto: CreateReactDto) {
        return this.reactsService.createReact(user, createReactDto);
    }

    @SerializeOptions({
        type: ReactResponseDto
    })
    @Post(':targetId')
    @Auth([RoleType.USER])
    async getReactByTargetId(
        @AuthUser() user: UserEntity,
        @Body() { targetId, targetType }: GetReactByTargetIdDto
    ) {
        return this.reactsService.getReactByTargetId(user, targetId, targetType);
    }
}