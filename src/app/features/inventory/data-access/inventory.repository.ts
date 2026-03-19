import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class InventoryRepository extends ApiService {

  getHardwareList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('Hardware/LeerTodo', params);
  }

  updateHardware(id: number, body: any): Observable<any> {
    return this.update('Hardware/Actualizar', id, body);
  }

  deleteHardware(ids: number[]): Observable<any> {
    return this.deleteMany('Hardware/Eliminar', ids);
  }

  getActaPdf(): Observable<Blob> {
    return this.getBlob('Hardware/GenerarActa');
  }

  getActaExcel(): Observable<Blob> {
    return this.getBlob('Hardware/GenerarActaExcel');
  }

  getKitsList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('Kits/LeerTodo', params);
  }

  updateKit(id: number, body: any): Observable<any> {
    return this.update('Kits/Actualizar', id, body);
  }

  getKitsActaPdf(): Observable<Blob> {
    return this.getBlob('Kits/GenerarActa');
  }

  triggerDownload(blob: Blob, name: string, ext: string): void {
    this.downloadFile(blob, name, ext);
  }
}
