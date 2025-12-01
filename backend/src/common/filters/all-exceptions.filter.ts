import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';

/**
 * Genel Hata Filtresi
 * Tüm yakalanmayan hataları yakalar ve standardlaştırılmış yanıt gönderir
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Sunucu hatası oluştu';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // Response object ise, message ve errors'u çıkar
      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message || message;
        // Validation errors varsa göster
        if (resp.message instanceof Array) {
          errors = resp.message;
          message = 'Doğrulama hatası';
        }
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Validation errors varsa ekle
    if (errors) {
      (errorResponse as any).errors = errors;
    }

    response.status(status).json(errorResponse);
  }
}
