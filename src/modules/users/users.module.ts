import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';

dotenv.config();
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '3h' },
		}),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
