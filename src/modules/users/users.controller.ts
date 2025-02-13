import { Controller, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UserService) {}

	// 1. Lấy danh sách user
	@Get()
	async getAllUsers() {
		console.log("Received request to get all users");
		return this.usersService.findAll();
	}

	// 2. Khóa/Mở khóa tài khoản
	@Put(":id/ban")
	async banUser(@Param("id") id:string){
		console.log(`Received request to ban user with ID: ${id}`);
		return this.usersService.banUser(id);
	}

	@Put(":id/unban")
	async unbanUser(@Param("id") id:string){
		console.log(`Received request to unban user with ID: ${id}`);
		return this.usersService.unbanUser(id);
	}

	@Delete(":id")
	async deleteUser(@Param("id") id:string){
		return this.usersService.deleteUser(id);
	}
}
