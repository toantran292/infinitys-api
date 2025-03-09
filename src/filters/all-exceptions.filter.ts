import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiException } from '../exceptions/api.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        // Log ngay khi bắt được exception
        this.logger.debug('Exception caught by AllExceptionsFilter');

        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorDetail = null;

        try {
            if (exception instanceof HttpException) {
                httpStatus = exception.getStatus();
                const response = exception.getResponse();
                message = typeof response === 'string' ? response : (response as any).message;
                this.logger.debug(`HttpException caught: ${message}`);
            } else if (exception instanceof ApiException) {
                httpStatus = exception.getStatus();
                message = exception.message;
                this.logger.debug(`ApiException caught: ${message}`);
            }

            errorDetail = exception instanceof Error
                ? {
                    name: exception.name,
                    message: exception.message,
                    stack: exception.stack
                }
                : String(exception);

            const responseBody = {
                statusCode: httpStatus,
                timestamp: new Date().toISOString(),
                path: httpAdapter.getRequestUrl(request),
                message,
                error: errorDetail
            };

            // Log chi tiết response
            this.logger.error({
                method: request.method,
                url: request.url,
                error: errorDetail,
                statusCode: httpStatus
            });

            // Kiểm tra xem response đã được gửi chưa
            if (!response.headersSent) {
                httpAdapter.reply(response, responseBody, httpStatus);
            } else {
                this.logger.warn('Response headers already sent');
            }

        } catch (error) {
            // Log lỗi nếu có vấn đề trong quá trình xử lý exception
            this.logger.error('Error in exception filter', error);
            if (!response.headersSent) {
                httpAdapter.reply(response, {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error during error handling',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
} 