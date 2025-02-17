import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RoleType } from 'src/constants/role-type';

@Injectable()
export class AuthsService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		private readonly configService: ConfigService,
	) {}

	async signUp(signUpDto: SignUpDto) {
		const { firstName, lastName, email, password } = signUpDto;

		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			throw new BadRequestException('Email đã tồn tại');
		}
		const salt = parseInt(
			this.configService.get<string>('SALT_ROUND') || '11',
			10,
		);

		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = this.userRepo.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			role: RoleType.USER,
		});

		await this.userRepo.save(newUser);
		const accessToken = this.signToken(newUser);

		return { message: 'Đăng ký thành công', token: accessToken };
	}

	async signIn(
		signInDto: SignInDto,
		require_admin: boolean = false
	): Promise<{ message: string; token: string }> {
		const { email, password } = signInDto;
		const user = await this.userRepo.findOne({ where: { email } });

		if (!user) {
			throw new BadRequestException('Sai tên đăng nhập hoặc mật khẩu');
		}

		if (require_admin && user.role !== RoleType.ADMIN || !require_admin && user.role === RoleType.ADMIN) {
			throw new BadRequestException('Bạn không có quyền truy cập');
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			throw new BadRequestException('Sai tên đăng nhập hoặc mật khẩu');
		}

		const accessToken = this.signToken(user);
		return {
			message: 'Đăng nhập thành công',
			token: accessToken,
		};
	}

	signToken(user: UserEntity): string {
		const jwtSecret =
			this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
		const expiresIn = this.configService.get<string>('JWT_EXPIRESIN') || '3h';
		return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
			expiresIn,
		});
	}
}
