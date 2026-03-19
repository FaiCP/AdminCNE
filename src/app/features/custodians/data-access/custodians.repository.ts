import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse, ListParams } from 'src/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class CustodiansRepository extends ApiService {

  getCustodiansList(params: ListParams): Observable<PaginatedResponse<any>> {
    return this.getList('Custodios/LeerTodo', params);
  }

  updateCustodian(id: number, body: any): Observable<any> {
    return this.update('Custodios/Actualizar', id, body);
  }

  deleteCustodian(ids: number[]): Observable<any> {
    return this.deleteMany('Custodios/Eliminar', ids);
  }
}
