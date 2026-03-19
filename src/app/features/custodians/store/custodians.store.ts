import { Injectable, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustodiansRepository } from '../data-access/custodians.repository';

@Injectable({ providedIn: 'root' })
export class CustodiansStore {
  private repo   = inject(CustodiansRepository);
  private toastr = inject(ToastrService);

  private readonly _items       = signal<any[]>([]);
  private readonly _total       = signal(0);
  private readonly _pageSize    = signal(10);
  private readonly _pageIndex   = signal(0);
  private readonly _search      = signal(' ');
  private readonly _isLoading   = signal(false);
  private readonly _editingId   = signal<number | null>(null);
  private readonly _editingSnap = signal<any>({});

  readonly items       = this._items.asReadonly();
  readonly total       = this._total.asReadonly();
  readonly pageSize    = this._pageSize.asReadonly();
  readonly pageIndex   = this._pageIndex.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly editingId   = this._editingId.asReadonly();
  readonly editingSnap = this._editingSnap.asReadonly();

  isEditing(id: number): boolean {
    return this._editingId() === id;
  }

  load(): void {
    this._isLoading.set(true);
    this.repo.getCustodiansList({
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

  setPage(size: number, index: number): void {
    this._pageSize.set(size);
    this._pageIndex.set(index);
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
    this.repo.updateCustodian(id, this._editingSnap()).subscribe({
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
    this.repo.deleteCustodian([id]).subscribe({
      next: () => {
        this.toastr.success('Eliminado');
        this.load();
      },
      error: (e: any) => {
        this.toastr.error(e?.error?.mensajes?.join(','), 'Error');
      }
    });
  }
}
