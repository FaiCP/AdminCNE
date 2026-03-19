import { Injectable, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StaffRepository } from '../data-access/staff.repository';

@Injectable({ providedIn: 'root' })
export class StaffStore {
  private repo   = inject(StaffRepository);
  private toastr = inject(ToastrService);

  private readonly _items       = signal<any[]>([]);
  private readonly _total       = signal(0);
  private readonly _pageSize    = signal(10);
  private readonly _pageIndex   = signal(0);
  private readonly _search      = signal('');
  private readonly _isLoading   = signal(false);
  private readonly _editingId   = signal<number | null>(null);
  private readonly _editingSnap = signal<any>({});
  private readonly _selected    = signal<number[]>([]);

  readonly items       = this._items.asReadonly();
  readonly total       = this._total.asReadonly();
  readonly pageSize    = this._pageSize.asReadonly();
  readonly pageIndex   = this._pageIndex.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly editingId   = this._editingId.asReadonly();
  readonly editingSnap = this._editingSnap.asReadonly();
  readonly selected    = this._selected.asReadonly();

  isEditing(id: number): boolean {
    return this._editingId() === id;
  }

  load(): void {
    this._isLoading.set(true);
    this.repo.getStaffList({
      cantidad: this._pageSize(),
      pagina: this._pageIndex(),
      busqueda: this._search()
    }).subscribe({
      next: res => {
        this._items.set(res.datos.elementos);
        this._total.set(res.datos.cantidadTotal);
        this._isLoading.set(false);
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
        this._isLoading.set(false);
      }
    });
  }

  setPage(pageSize: number, pageIndex: number): void {
    this._pageSize.set(pageSize);
    this._pageIndex.set(pageIndex);
    this.load();
  }

  setSearch(q: string): void {
    this._search.set(q);
    this._pageIndex.set(0);
    this.load();
  }

  startEdit(item: any): void {
    this._editingId.set(item.id);
    this._editingSnap.set({ ...item });
  }

  cancelEdit(): void {
    this._editingId.set(null);
    this._editingSnap.set({});
  }

  updateSnap(patch: any): void {
    this._editingSnap.update((s: any) => ({ ...s, ...patch }));
  }

  saveEdit(): void {
    const id = this._editingId();
    if (id === null) return;
    this.repo.updateStaff(id, this._editingSnap()).subscribe({
      next: () => {
        this.toastr.success('Actualizado');
        this._editingId.set(null);
        this.load();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  delete(id: number): void {
    if (!confirm(`¿Eliminar ID: ${id}?`)) return;
    this.repo.deleteStaff([id]).subscribe({
      next: () => {
        this.toastr.success('Eliminado');
        this.load();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }

  toggleSelected(id: number, checked: boolean): void {
    this._selected.update(s => checked ? [...s, id] : s.filter(x => x !== id));
  }

  downloadActaPdf(): void {
    const ids = this._selected();
    if (!ids.length) {
      this.toastr.warning('Seleccione al menos un registro');
      return;
    }
    this.repo.getActaPdf(ids).subscribe({
      next: b => this.repo.triggerDownload(b, 'Acta_Credencial', 'pdf'),
      error: e => console.error(e)
    });
  }
}
