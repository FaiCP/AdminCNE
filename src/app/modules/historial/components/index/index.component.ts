import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { HistoryStore } from 'src/app/features/history/store/history.store';
import { HttpService } from 'src/app/services/Http.service';
import { GlobalModule } from 'src/app/modules/global/global.module';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [GlobalModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit {
  store       = inject(HistoryStore);
  httpService = inject(HttpService);

  displayedColumns = ['Nº','CÓDIGO_ACTUAL','nombre_dispositivo','SERIE',
                      'MODELO','MARCA','fecha_asignacion','fecha_devolucion','VALOR','ESTADO'];

  readonly tamanioPaginaOptions = [1, 5, 10, 25, 100];
  get cantidadTotal()  { return this.store.total(); }
  get CantidadPagina() { return this.store.pageSize(); }
  get numerPagina()    { return this.store.pageIndex(); }
  get custodios()      { return this.store.custodios(); }

  departamentos: any[] = [];
  prestamo = { id_custodio: '' as any, id_departamento: '' as any };

  trackById(_: number, item: any): any { return item.id ?? _; }

  ngOnInit(): void {
    this.store.loadCustodios();
    this.cargarDepartamentos();
  }

  private normalize(res: any): any[] {
    const inner = res.datos ?? res.data ?? res;
    return inner.elementos ?? inner.items ?? [];
  }

  cargarDepartamentos(): void {
    this.httpService.LeerTodo(100, 0, '', 'departamentos/LeerTodo')
      .subscribe((res: any) => { this.departamentos = this.normalize(res); });
  }

  onCustodioChange(custodioId: number): void {
    this.store.loadHistorial(custodioId);
    const selected = this.custodios.find(c => c.id === custodioId);
    if (!selected) return;
    const depNombre = selected.departamento;
    const dep = this.departamentos.find(d =>
      (d.nombre ?? d.name ?? '').toLowerCase() === (depNombre ?? '').toLowerCase()
    );
    if (dep) this.prestamo.id_departamento = dep.id;
  }

  applyFilter(event: Event): void { }
  cambiarPagina(event: any): void { this.store.setPage(event.pageSize, event.pageIndex); }
  enviarActa(): void              { this.store.downloadActaPdf(); }
}
