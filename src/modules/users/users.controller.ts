import { Controller, Get, Param, Put, Delete, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	// 1. Lấy danh sách user
	@Get()
	async getAllUsers() {
		console.log("Received request to get all users");
		return this.usersService.findAll();
	}

	@Get(':id')
	async getUserById(@Param('id') id: string) {
		console.log(`Fetching user with ID: ${id}`);
		const user = await this.usersService.findOne(id);
		if (!user) throw new NotFoundException('User not found');
		return user;
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
