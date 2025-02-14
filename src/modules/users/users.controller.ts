import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
}
