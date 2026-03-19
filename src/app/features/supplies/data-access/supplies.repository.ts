import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class SuppliesRepository extends ApiService {

  getSuppliesList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('Suministros/LeerTodo', params);
  }

  updateSupply(id: number, body: any): Observable<any> {
    return this.update('Suministros/Actualizar', id, body);
  }

  deleteSupply(ids: number[]): Observable<any> {
    return this.deleteMany('Suministros/Eliminar', ids);
  }
}
