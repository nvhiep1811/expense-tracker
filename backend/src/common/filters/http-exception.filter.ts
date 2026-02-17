import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          (typeof responseObj.message === 'string'
            ? responseObj.message
            : exception.message) || message;
        errors = responseObj.errors ?? null;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      console.error('Unhandled error:', exception);
    }

    // Log 500 errors for debugging
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      console.error('Internal Server Error:', {
        message,
        exception: isDevelopment ? exception : undefined,
        stack:
          isDevelopment && exception instanceof Error
            ? exception.stack
            : undefined,
      });
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
