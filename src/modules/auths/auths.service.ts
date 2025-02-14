import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RoleType } from 'src/constants/role-type';

@Injectable()
export class AuthsService {
	private SALT_ROUND = 11;
	private JWT_SECRET = 'your-secret-key';

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async signUp(signUpDto: SignUpDto) {
		const { firstName, lastName, email, password } = signUpDto;

		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			throw new BadRequestException('Email đã tồn tại');
		}

		const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
		const newUser = this.userRepo.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			role: RoleType.USER,
		});

		await this.userRepo.save(newUser);
		const accessToken = jwt.sign(
			{ id: newUser.id, email: newUser.email },
			this.JWT_SECRET,
			{ expiresIn: '3h' },
		);

		return { message: 'Đăng ký thành công', token: accessToken };
	}

	async signIn(
		signInDto: SignInDto,
	): Promise<{ message: string; token: string }> {
		const { email, password } = signInDto;
		const user = await this.userRepo.findOne({ where: { email } });
		if (!user) {
			throw new BadRequestException('Email không tồn tại');
		}

		if (user.role === RoleType.ADMIN) {
			throw new ForbiddenException('Bạn không có quyền truy cập');
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			throw new BadRequestException('Mật khẩu không đúng');
		}
		const accessToken = jwt.sign(
			{ sub: user.id, email: user.email },
			this.JWT_SECRET,
			{ expiresIn: '3h' },
		);
		return {
			message: 'Đăng nhập thành công',
			token: accessToken,
		};
	}
}
