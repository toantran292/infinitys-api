import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from '../../exeptions/user-not-found.exception';
import { validateHash } from '../../common/utils';
import { RoleType } from '../../constants/role-type';
import { TokenType } from '../../constants/token-type';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserLoginDto } from './dto/user-login.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthsService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ApiConfigService,
		private readonly userService: UsersService,
	) {}

	async createAccessToken(data: {
		role: RoleType;
		userId: Uuid;
		email: string;
	}): Promise<TokenPayloadDto> {
		return new TokenPayloadDto({
			expiresIn: this.configService.authConfig.jwtExpirationTime,
			accessToken: await this.jwtService.signAsync({
				userId: data.userId,
				type: TokenType.ACCESS_TOKEN,
				role: data.role,
				email: data.email,
			}),
		});
	}

	async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
		const user = await this.userService.findOne({
			email: userLoginDto.email,
		});

		const isPasswordValid = await validateHash(
			userLoginDto.password,
			user?.password,
		);

		if (!isPasswordValid) {
			throw new UserNotFoundException();
		}

		return user!;
	}

	// async signUp(signUpDto: SignUpDto) {
	// 	const { firstName, lastName, email, password } = signUpDto;
	//
	// 	const user = await this.userRepo.findOne({ where: { email } });
	// 	if (user) {
	// 		throw new BadRequestException('Email đã tồn tại');
	// 	}
	// 	const salt = parseInt(
	// 		this.configService.get<string>('SALT_ROUND') || '11',
	// 		10,
	// 	);
	//
	// 	const hashedPassword = await bcrypt.hash(password, salt);
	// 	const newUser = this.userRepo.create({
	// 		firstName,
	// 		lastName,
	// 		email,
	// 		password: hashedPassword,
	// 		role: RoleType.USER,
	// 	});
	//
	// 	await this.userRepo.save(newUser);
	// 	const accessToken = this.signToken(newUser);
	//
	// 	return { message: 'Đăng ký thành công', token: accessToken };
	// }
	//
	// async signIn(
	// 	signInDto: SignInDto,
	// 	require_admin: boolean = false,
	// ): Promise<{ message: string; token: string }> {
	// 	const { email, password } = signInDto;
	// 	const user = await this.userRepo.findOne({ where: { email } });
	//
	// 	if (!user) {
	// 		throw new BadRequestException('Sai tên đăng nhập hoặc mật khẩu');
	// 	}
	//
	// 	if (require_admin && user.role !== RoleType.ADMIN || !require_admin && user.role === RoleType.ADMIN) {
	// 		throw new BadRequestException('Bạn không có quyền truy cập');
	// 	}
	//
	// 	const isPasswordMatch = await bcrypt.compare(password, user.password);
	//
	// 	if (!isPasswordMatch) {
	// 		throw new BadRequestException('Sai tên đăng nhập hoặc mật khẩu');
	// 	}
	//
	// 	const accessToken = this.signToken(user);
	// 	return {
	// 		message: 'Đăng nhập thành công',
	// 		token: accessToken,
	// 	};
	// }
	//
	// signToken(user: UserEntity): string {
	// 	const jwtSecret =
	// 		this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
	// 	const expiresIn = this.configService.get<string>('JWT_EXPIRESIN') || '3h';
	// 	return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
	// 		expiresIn,
	// 	});
	// }
}
