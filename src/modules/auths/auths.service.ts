import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthsService {
	private SALT_ROUND = 11;

	constructor() {
	}

	async signUp(){}

	async signIn() {}
}
