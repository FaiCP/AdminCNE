import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { FormkitsComponent } from '../formkits/formkits.component';
import { InventoryStore } from 'src/app/features/inventory/store/inventory.store';
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
  store  = inject(InventoryStore);
  dialog = inject(MatDialog);

  displayedColumns  = ['numero','Custodio','Serie','id_equipo','marca','modelo','Descripcion','estado','descripcion','valor','borrado','editar'];
  displayedColumns1 = ['numero','INSUMO','MODELO','MARCA','SERIE','ESTADO','CANTIDAD','OBSERVACION','borrado','editar'];

  readonly tamanioPaginaOptions = [1, 5, 10, 25, 100];
  get cantidadTotal()  { return this.store.total(); }
  get cantidadTotalE() { return this.store.totalKits(); }
  get CantidadPagina() { return this.store.pageSize(); }
  get numerPagina()    { return this.store.pageIndex(); }
  get editandoElementoId() { return this.store.editingId(); }
  get elementoEditado()    { return this.store.editingSnap(); }

  ngOnInit(): void {
    this.store.loadHardware();
    this.store.loadKits();
  }

  openDialog(enter?: string, exit?: string): void {
    this.dialog.open(FormComponent, { width: 'auto', height: 'auto', data: 'genral dialogo' });
  }
  openDialogKits(enter?: string, exit?: string): void {
    this.dialog.open(FormkitsComponent, { width: 'auto', height: 'auto', data: 'kits dialogo' });
  }

  applyFilter(event: Event): void   { this.store.setSearch((event.target as HTMLInputElement).value); }
  cambiarPagina(event: any): void   { this.store.setPage(event.pageSize, event.pageIndex); }
  iniciarEdicion(el: any): void     { this.store.startEdit(el); }
  cancelarEdicion(): void           { this.store.cancelEdit(); }
  guardarEdicion(): void            { this.store.saveHardwareEdit(); }
  guardarEdicionKits(): void        { this.store.saveKitEdit(); }
  eliminar(id: number): void        { this.store.deleteHardware(id); }
  enviarActa(): void                { this.store.downloadHardwareActaPdf(); }
  enviarActaEXEL(): void            { this.store.downloadHardwareActaExcel(); }
  enviarActaKits(): void            { this.store.downloadKitsActaPdf(); }
}
