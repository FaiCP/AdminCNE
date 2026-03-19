import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { StaffStore } from 'src/app/features/staff/store/staff.store';
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
  store  = inject(StaffStore);
  dialog = inject(MatDialog);

  displayedColumns = ['cedula','nombre','cargo','correo','pass','Action','editar','select'];

  readonly tamanioPaginaOptions = [1, 5, 10, 25, 100];
  get cantidadTotal()  { return this.store.total(); }
  get CantidadPagina() { return this.store.pageSize(); }
  get numerPagina()    { return this.store.pageIndex(); }
  get editandoElementoId() { return this.store.editingId(); }
  get elementoEditado()    { return this.store.editingSnap(); }

  ngOnInit(): void { this.store.load(); }

  openDialog(enter?: string, exit?: string): void {
    this.dialog.open(FormComponent, { width: 'auto', height: 'auto', data: 'probando dialogos' });
  }

  applyFilter(event: Event): void               { this.store.setSearch((event.target as HTMLInputElement).value); }
  cambiarPagina(event: any): void               { this.store.setPage(event.pageSize, event.pageIndex); }
  iniciarEdicion(el: any): void                 { this.store.startEdit(el); }
  cancelarEdicion(): void                       { this.store.cancelEdit(); }
  guardarEdicion(): void                        { this.store.saveEdit(); }
  eliminar(id: number): void                    { this.store.delete(id); }
  enviarActa(): void                            { this.store.downloadActaPdf(); }
  onCheckboxChange(el: any, checked: boolean): void { this.store.toggleSelected(el.id, checked); }
}
