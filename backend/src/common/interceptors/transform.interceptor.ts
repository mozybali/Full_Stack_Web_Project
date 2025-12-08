import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Transform Interceptor
 * 
 * Backend'den dönen verileri frontend'in beklediği formata dönüştürür:
 * - Decimal string değerleri number'a çevirir
 * - Date objelerini ISO string'e çevirir
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.transformData(data))
    );
  }

  private transformData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    // Array ise her elemanı transform et
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    // Object ise her property'yi transform et
    if (typeof data === 'object') {
      const transformed: any = {};
      
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          
          // Price alanını number'a çevir
          if (key === 'price' && typeof value === 'string') {
            transformed[key] = parseFloat(value);
          }
          // Date objelerini ISO string'e çevir
          else if (value instanceof Date) {
            transformed[key] = value.toISOString();
          }
          // Nested object/array ise recursive transform
          else if (typeof value === 'object' && value !== null) {
            transformed[key] = this.transformData(value);
          }
          // Diğer değerleri olduğu gibi bırak
          else {
            transformed[key] = value;
          }
        }
      }
      
      return transformed;
    }

    return data;
  }
}
