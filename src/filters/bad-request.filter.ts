import { Catch, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty, snakeCase } from 'lodash';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter
	implements ExceptionFilter<UnprocessableEntityException>
{
	constructor(public reflector: Reflector) {}

	catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const statusCode = exception.getStatus();
		const r = exception.getResponse() as { message: ValidationError[] };

		const validationErrors = r.message;

		this.validationFilter(validationErrors);

		response.status(statusCode).json(r);
	}

	private validationFilter(validationErrors: ValidationError[]): void {
		for (const validationError of validationErrors) {
			const children = validationError.children;
			if (children && !isEmpty(children)) {
				this.validationFilter(children);

				return;
			}

			delete validationError.children;

			const constraints = validationError.constraints;

			if (!constraints) {
				return;
			}

			for (const [constraintKey, constraint] of Object.entries(constraints)) {
				// convert default messages
				if (!constraint) {
					// convert error message to error.fields.{key} syntax for i18n translation
					constraints[constraintKey] = `error.fields.${snakeCase(
						constraintKey,
					)}`;
				}
			}
		}
	}
}
