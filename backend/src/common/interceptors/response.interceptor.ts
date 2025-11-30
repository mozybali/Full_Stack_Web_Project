import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response Wrapper Interceptor
 * Tüm başarılı yanıtları standardlaştırılmış bir format'ta sarmalar
 */
export interface ResponseWrapper<T> {
  statusCode: number;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        data,
        message: this.getSuccessMessage(request.method, request.path),
        timestamp: new Date().toISOString(),
      })),
    );
  }

  /**
   * HTTP metodu ve path'e göre başarı mesajı döndür
   */
  private getSuccessMessage(method: string, path: string): string {
    if (method === 'POST') {
      return 'Başarıyla oluşturuldu';
    } else if (method === 'PUT' || method === 'PATCH') {
      return 'Başarıyla güncellendi';
    } else if (method === 'DELETE') {
      return 'Başarıyla silindi';
    } else if (method === 'GET') {
      return 'Başarıyla alındı';
    }
    return 'İşlem başarılı';
  }
}
