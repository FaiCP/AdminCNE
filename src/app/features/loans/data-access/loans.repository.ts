import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class LoansRepository extends ApiService {

  getLoansList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('GestionActivos/LeerTodo', params);
  }

  updateLoan(id: number, body: any): Observable<any> {
    return this.update('GestionActivos/Actualizar', id, body);
  }

  deleteLoan(ids: number[]): Observable<any> {
    return this.deleteMany('GestionActivos/Eliminar', ids);
  }

  getDevolucionPdf(ids: number[]): Observable<Blob> {
    return this.getBlob('GestionActivos/devolucion', { ids: ids.join(',') });
  }

  getReportePdf(): Observable<Blob> {
    return this.getBlob('Personal/GenerarReporte');
  }

  getReporteExcel(): Observable<Blob> {
    return this.getBlob('Personal/GenerarReporteExel');
  }

  triggerDownload(blob: Blob, name: string, ext: string): void {
    this.downloadFile(blob, name, ext);
  }
}
