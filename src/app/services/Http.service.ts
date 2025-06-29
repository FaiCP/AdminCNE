import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class HttpService{

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  ruta = environment.apiUrl; // Cambia esto por la URL de tu API

  constructor(
    private httpClienete:HttpClient
    ){}

    LeerTodo(cantidad:number , pagina:number , textoBusqueda:string, rutaEspecifica:string){

      let parametros = new HttpParams();

      parametros = parametros.append('cantidad',cantidad);
      parametros = parametros.append('pagina',pagina);
      parametros = parametros.append('busqueda',textoBusqueda );

      return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`,{params : parametros});
    }
    LeerHistorial(cantidad:number , pagina:number , busqueda:string,idCustodio:number, rutaEspecifica:string){

      let parametros = new HttpParams();

      parametros = parametros.append('cantidad',cantidad);
      parametros = parametros.append('pagina',pagina);
      parametros = parametros.append('busqueda',busqueda);
      parametros = parametros.append('idCustodio',idCustodio);


      return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`,{params : parametros});
    }

    GenerarActaPDF(ids: number[],rutaEspecifica: string): Observable<Blob> {
  if (!ids || ids.length === 0) {
    throw new Error("El array de IDs está vacío o no es válido.");
  }

  const params = new HttpParams().set('ids', ids.join(','));
  const url = `${this.ruta}/${rutaEspecifica}`;

  return this.httpClienete.get(url, {
    params,
    responseType: 'blob'
  });
}


  

  GenerarActaDevolucionPDF(ids: number[], rutaEspecifica: string) {
  if (!ids || ids.length === 0) {
    throw new Error("El array de IDs está vacío o no es válido.");
  }

  const idsString = ids.join(',');
  const url = `${this.ruta}/${rutaEspecifica}?ids=${idsString}`;
  return this.httpClienete.get(url, {
    responseType: 'blob'
  });
}

  

    GenerarActaHardPDF(rutaEspecifica: string) {
    return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`, {
        responseType: 'blob', 
      });
  }
  GenerarActaHardEXEL(rutaEspecifica: string) {
    return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`, {
        responseType: 'blob', 
      });
  }

    GenerarActaPerdPDF(ids: number[],rutaEspecifica:string) {
      const params = ids.join(',');
      return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}/${ids}`, {
       responseType: 'blob'
      });
}


    LeerUno(id: number,rutaEspecifica:string){
      return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}/${id}`);
    }

    Post(objecto: any,rutaEspecifica:string){
      return this.httpClienete.post(`${this.ruta}/${rutaEspecifica}`,objecto);
    }

    Actualizar(id: number,objecto: any,rutaEspecifica: string){
      return this.httpClienete.put(`${this.ruta}/${rutaEspecifica}/${id}`,objecto);
    }
    Eliminarasync(ids: number[], rutaEspecifica: string): Observable<any> {
      const params = new HttpParams({ fromObject: { ids: ids.map(String) } });
      return this.httpClienete.delete(`${this.ruta}/${rutaEspecifica}`, { params });
    }

    Eliminar(ids:number[],rutaEspecifica: string) {

      const idsStr = ids.join(','); 
  return this.httpClienete.delete(`${this.ruta}/${rutaEspecifica}/${idsStr}`);
}

obtenerInventarioTotal(rutaEspecifica: string): Observable<any> {
  return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`);
}

obtenerPrestamosPorMes(rutaEspecifica: string): Observable<any> {
  return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}`);
}

obtenerEquiposPrestadosPorTipo(rutaEspecifica: string): Observable<any> {
  return this.httpClienete.get(`${this.ruta}/${rutaEspecifica}/Reportes/EquiposPrestadosPorTipo`);
}
}
