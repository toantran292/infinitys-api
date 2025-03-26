import { STATUS_CODES } from 'node:http';

import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

import { constraintErrors } from './constraint-errors';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
	constructor(public reflector: Reflector) {}

	catch(
		exception: QueryFailedError & { constraint?: string },
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status = exception.constraint?.startsWith('UQ')
			? HttpStatus.CONFLICT
			: HttpStatus.INTERNAL_SERVER_ERROR;

		console.log({ exception });

		response.status(status).json({
			statusCode: status,
			error: STATUS_CODES[status],
			message: exception.constraint
				? constraintErrors[exception.constraint]
				: undefined,
		});
	}
}
