import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiTags} from "@nestjs/swagger";
import {RoleType} from "../../constants/role-type";
import {Auth} from "../../decoractors/http.decorators";
import {UserEntity} from "./entities/user.entity";
import {AuthUser} from "../../decoractors/auth-user.decorators";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN])
  async admin(@AuthUser() user: UserEntity) {
    return user.first_name;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
