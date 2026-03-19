import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { LoansStore } from 'src/app/features/loans/store/loans.store';
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
  store  = inject(LoansStore);
  dialog = inject(MatDialog);

  displayedColumns = ['numero','nombre_empleado','nombre_dispositivo','haedware.marca',
                      'Serie','haedware.modelo','id_equipo','fecha_asignacion','fecha_devolucion','editar','borrado'];

  readonly tamanioPaginaOptions = [1, 5, 10, 25, 100];
  get cantidadTotal()  { return this.store.total(); }
  get CantidadPagina() { return this.store.pageSize(); }
  get numerPagina()    { return this.store.pageIndex(); }

  // Bridge: loans uses array + map for multi-row edit
  get editandoElementosIds() { return this.store.editingIds(); }
  get elementosEditados()    { return this.store.editingMap(); }

  ngOnInit(): void { this.store.load(); }

  openDialog(enter?: string, exit?: string): void {
    this.dialog.open(FormComponent, { width: 'auto', height: 'auto', data: 'probando dialogos' });
  }

  applyFilter(event: Event): void          { this.store.setSearch((event.target as HTMLInputElement).value); }
  cambiarPagina(event: any): void          { this.store.setPage(event.pageSize, event.pageIndex); }
  iniciarEdicion(el: any): void            { this.store.startEdit(el); }
  cancelarEdicion(el: any): void           { this.store.cancelEdit(el); }
  guardarEdicion(): void                   { this.store.saveAll(); }
  eliminar(id: number): void               { this.store.delete(id); }
  enviarReporte(): void                    { this.store.downloadReportePdf(); }
  enviarActaEXEL(): void                   { this.store.downloadReporteExcel(); }
  enviarActa(ids: any): void               { this.store.saveAll(); }
}
