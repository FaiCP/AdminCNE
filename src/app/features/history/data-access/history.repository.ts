import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class HistoryRepository extends ApiService {

  getHistorialList(
    cantidad: number,
    pagina: number,
    busqueda: string,
    idCustodio: number
  ): Observable<PaginatedResponse<any>> {
    return this.getListCustom<PaginatedResponse<any>>(
      'HistorialPrestamos/LeerTodo',
      { cantidad, pagina, busqueda, idCustodio }
    );
  }

  getCustodios(): Observable<PaginatedResponse<any>> {
    return this.getList<any>('Custodios/LeerTodo', { cantidad: 100, pagina: 0, busqueda: '' });
  }

  getActaPdf(ids: number[]): Observable<Blob> {
    return this.getBlob('HistorialPrestamos/GenerarActa', { ids: ids.join(',') });
  }

  triggerDownload(blob: Blob, name: string, ext: string): void {
    this.downloadFile(blob, name, ext);
  }
}
