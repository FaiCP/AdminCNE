import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface PaginatedResponse<T> {
  datos: {
    elementos: T[];
    cantidadTotal: number;
  };
}

export interface ListParams {
  cantidad: number;
  pagina: number;
  busqueda: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  protected http = inject(HttpClient);
  protected readonly baseUrl = `${environment.apiUrl}/api`;

  protected getList<T>(endpoint: string, params: ListParams): Observable<PaginatedResponse<T>> {
    const httpParams = new HttpParams()
      .set('cantidad', params.cantidad)
      .set('pagina', params.pagina)
      .set('busqueda', params.busqueda);
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`, { params: httpParams }).pipe(
      map(res => {
        const inner     = res.datos ?? res.data ?? res;
        const elementos = inner.elementos ?? inner.items ?? [];
        const cantidadTotal = inner.cantidadTotal ?? inner.totalCount ?? inner.total ?? 0;
        return { datos: { elementos, cantidadTotal } } as PaginatedResponse<T>;
      })
    );
  }

  protected getListCustom<T>(endpoint: string, params: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { httpParams = httpParams.set(k, String(v)); });
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`, { params: httpParams }).pipe(
      map(res => {
        const inner     = res.datos ?? res.data ?? res;
        const elementos = inner.elementos ?? inner.items ?? [];
        const cantidadTotal = inner.cantidadTotal ?? inner.totalCount ?? inner.total ?? 0;
        return { datos: { elementos, cantidadTotal } } as T;
      })
    );
  }

  protected getOne<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  protected create<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  protected update<T>(endpoint: string, id: number, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, body);
  }

  protected deleteMany<T>(endpoint: string, ids: number[]): Observable<T> {
    const params = new HttpParams({ fromObject: { ids: ids.map(String) } });
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  protected getBlob(endpoint: string, params?: Record<string, string>): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => { httpParams = httpParams.set(k, v); });
    }
    return this.http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams, responseType: 'blob' });
  }

  protected downloadFile(blob: Blob, name: string, ext: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
