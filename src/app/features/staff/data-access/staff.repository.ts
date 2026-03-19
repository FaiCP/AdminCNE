import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class StaffRepository extends ApiService {

  getStaffList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('Personal/LeerTodo', params);
  }

  updateStaff(id: number, body: any): Observable<any> {
    return this.update('Personal/Actualizar', id, body);
  }

  deleteStaff(ids: number[]): Observable<any> {
    return this.deleteMany('Personal/Eliminar', ids);
  }

  getActaPdf(ids: number[]): Observable<Blob> {
    return this.getBlob('Personal/GenerarActa', { ids: ids.join(',') });
  }

  triggerDownload(blob: Blob, name: string, ext: string): void {
    this.downloadFile(blob, name, ext);
  }
}
